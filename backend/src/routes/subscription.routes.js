import { Router } from "express";
import {
  toggleSubscription,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/:channelId", toggleSubscription);
router.get("/", getSubscribedChannels);

export default router;
