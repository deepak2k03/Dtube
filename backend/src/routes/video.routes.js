import { Router } from "express";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// PUBLIC
router.get("/", getAllVideos);
router.get("/:videoId", getVideoById);

// PROTECTED
router.use(verifyJWT);

router.post(
  "/",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);

router.patch(
  "/:videoId",
  upload.single("thumbnail"),
  updateVideo
);

router.delete("/:videoId", deleteVideo);

export default router;
