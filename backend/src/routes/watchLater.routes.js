import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleWatchLater,
  getWatchLater,
} from "../controllers/watchLater.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/:videoId", toggleWatchLater);
router.get("/", getWatchLater);

export default router;
