import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  searchUsers, // ✅ THIS WAS MISSING
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/* ================= PUBLIC ROUTES ================= */

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

/* ================= PROTECTED ROUTES ================= */

router.use(verifyJWT);

router.post("/logout", logoutUser);
router.get("/current-user", getCurrentUser);
router.patch("/update-account", updateAccountDetails);
router.patch("/avatar", upload.single("avatar"), updateUserAvatar);
router.patch("/coverImage", upload.single("coverImage"), updateUserCoverImage);
router.get("/history", getWatchHistory);
router.get("/c/:username", getUserChannelProfile);

/* 🔍 SEARCH USERS */
router.get("/search", searchUsers);

export default router;
