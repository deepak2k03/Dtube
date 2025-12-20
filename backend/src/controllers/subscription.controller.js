import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

/**
 * Toggle subscribe / unsubscribe
 */
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const existing = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existing) {
    await existing.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed"));
  }

  await Subscription.create({
    subscriber: subscriberId,
    channel: channelId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Subscribed"));
});

/**
 * Get channels user subscribed to
 */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({
    subscriber: req.user._id,
  }).populate("channel", "username fullName avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      subscriptions.map((s) => s.channel),
      "Subscribed channels fetched"
    )
  );
});

export {
  toggleSubscription,
  getSubscribedChannels,
};
