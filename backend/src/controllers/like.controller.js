import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const existingLike = await Like.findOne({
    video: videoId,
    user: userId,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, "Like removed"));
  }

  await Like.create({
    video: videoId,
    user: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { liked: true }, "Video liked"));
});

export { toggleVideoLike };
