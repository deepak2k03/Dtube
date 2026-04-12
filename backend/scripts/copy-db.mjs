import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = (process.env.MONGODB_URI || "").replace(/^"|"$/g, "");
const sourceDbName = process.env.SOURCE_DB_NAME || "dtube";
const targetDbName = process.env.TARGET_DB_NAME || "Vidget";

const collectionsToCopy = [
  "users",
  "videos",
  "comments",
  "likes",
  "playlists",
  "subscriptions",
];

if (!uri) {
  console.error("MONGODB_URI is missing.");
  process.exit(1);
}

if (sourceDbName === targetDbName) {
  console.error("SOURCE_DB_NAME and TARGET_DB_NAME cannot be the same.");
  process.exit(1);
}

const client = new MongoClient(uri);

const copyCollection = async (sourceDb, targetDb, collectionName) => {
  const sourceCol = sourceDb.collection(collectionName);
  const targetCol = targetDb.collection(collectionName);

  const docs = await sourceCol.find({}).toArray();

  if (!docs.length) {
    return { collectionName, sourceCount: 0, upserted: 0 };
  }

  const operations = docs.map((doc) => ({
    replaceOne: {
      filter: { _id: doc._id },
      replacement: doc,
      upsert: true,
    },
  }));

  const result = await targetCol.bulkWrite(operations, { ordered: false });

  const upserted = (result.upsertedCount || 0) + (result.modifiedCount || 0);

  return {
    collectionName,
    sourceCount: docs.length,
    upserted,
  };
};

const run = async () => {
  try {
    await client.connect();

    const sourceDb = client.db(sourceDbName);
    const targetDb = client.db(targetDbName);

    console.log(`Copying data from '${sourceDbName}' to '${targetDbName}'`);

    for (const name of collectionsToCopy) {
      const res = await copyCollection(sourceDb, targetDb, name);
      console.log(
        `${res.collectionName}: source=${res.sourceCount}, written=${res.upserted}`
      );
    }

    const targetVideos = await targetDb.collection("videos").countDocuments();
    const targetUsers = await targetDb.collection("users").countDocuments();

    console.log(`Final '${targetDbName}' counts -> users=${targetUsers}, videos=${targetVideos}`);
  } catch (error) {
    console.error("Copy failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

run();
