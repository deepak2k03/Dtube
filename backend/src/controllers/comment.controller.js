import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* CREATE COMMENT */
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  const populated = await comment.populate("owner", "username avatar");

  res
    .status(201)
    .json(new ApiResponse(201, populated, "Comment added"));
});

/* GET COMMENTS */
export const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await Comment.find({ video: videoId })
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched"));
});
