import Playlist from "../models/playlist.model.js";

/* ================= CREATE PLAYLIST ================= */
export const createPlaylist = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Playlist name is required",
      });
    }

    const playlist = await Playlist.create({
      name: name.trim(),
      owner: req.user._id,
      videos: [],
    });

    return res.status(201).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create playlist",
    });
  }
};

/* ================= GET USER PLAYLISTS ================= */
export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      owner: req.user._id,
    }).populate("videos");

    res.json({
      success: true,
      data: playlists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch playlists",
    });
  }
};

/* ================= ADD VIDEO ================= */
export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    const alreadyExists = playlist.videos.some(
      (v) => v.toString() === videoId
    );

    if (!alreadyExists) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    res.json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to add video",
    });
  }
};

/* ================= REMOVE VIDEO ================= */
export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    playlist.videos = playlist.videos.filter(
      (v) => v.toString() !== videoId
    );

    await playlist.save();

    res.json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to remove video",
    });
  }
};

/* ================= DELETE PLAYLIST ================= */
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user._id,
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete playlist",
    });
  }
};

/* ================= GET PLAYLIST BY ID ================= */
export const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: req.user._id,
    }).populate({
      path: "videos",
      populate: {
        path: "owner",
        select: "username avatar",
      },
    });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    res.json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch playlist",
    });
  }
};
