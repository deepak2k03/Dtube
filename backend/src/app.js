import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import likeRouter from "./routes/like.routes.js";
import watchLaterRoutes from "./routes/watchLater.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
const app = express();

const allowedOrigins =
  (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean) || [];

// Fallback to local dev origin if nothing is configured
if (allowedOrigins.length === 0) {
  allowedOrigins.push("http://localhost:5173");
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & tools like Postman
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use(express.json({limit:"16kb"}));
app.use(urlencoded({ extended: true, limit:"16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/watch-later", watchLaterRoutes);
app.use("/api/v1/playlists", playlistRoutes);

//routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";

//routes declaration  
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/comments", commentRouter);

export { app };
