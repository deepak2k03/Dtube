import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

export const toggleWatchLater = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const user = await User.findById(req.user._id);

  const exists = user.watchLater.includes(videoId);

  if (exists) {
    user.watchLater.pull(videoId);
  } else {
    user.watchLater.push(videoId);
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(200, user.watchLater, "Watch later updated")
  );
});

export const getWatchLater = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("watchLater");

  return res
    .status(200)
    .json(new ApiResponse(200, user.watchLater, "Watch later videos"));
});
