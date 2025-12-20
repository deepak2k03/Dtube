import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  getVideoComments,
} from "../controllers/comment.controller.js";

const router = Router();

router.get("/:videoId", getVideoComments);
router.post("/:videoId", verifyJWT, addComment);

export default router;
