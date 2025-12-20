import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.post("/video/:videoId", verifyJWT, toggleVideoLike);

export default router;
