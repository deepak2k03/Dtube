import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import likeRouter from "./routes/like.routes.js";
import watchLaterRoutes from "./routes/watchLater.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";

dotenv.config();

const app = express();

/* ===== CORS ===== */


const allowedOrigins = (
  process.env.CLIENT_URL || ""
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked: ${origin}`)
      );
    },
    credentials: true,
  })
);


/* ===== MIDDLEWARE ===== */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* ===== ROUTES ===== */
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/watch-later", watchLaterRoutes);
app.use("/api/v1/playlists", playlistRoutes);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);

export { app };
