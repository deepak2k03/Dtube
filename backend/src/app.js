import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import likeRouter from "./routes/like.routes.js";
import watchLaterRoutes from "./routes/watchLater.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import commentRouter from "./routes/comment.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

/* ===== CORS (PRODUCTION SAFE) ===== */
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-side calls (Render health checks, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❌ DO NOT THROW ERROR IN PROD
      console.log("Blocked by CORS:", origin);
      return callback(null, false);
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

/* ===== ERROR HANDLER ===== */
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export { app };
