import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../controllers/playlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createPlaylist);
router.get("/", verifyJWT, getUserPlaylists);
router.get("/:playlistId", verifyJWT, getPlaylistById);

router.post("/:playlistId/video/:videoId", verifyJWT, addVideoToPlaylist);
router.delete("/:playlistId/video/:videoId", verifyJWT, removeVideoFromPlaylist);

router.delete("/:playlistId", verifyJWT, deletePlaylist);

export default router;
