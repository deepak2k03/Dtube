import axios from "./axios";

/* CREATE PLAYLIST */
export const createPlaylist = (name) => {
  return axios.post("/playlists", { name });
};

/* GET MY PLAYLISTS */
export const getMyPlaylists = () => {
  return axios.get("/playlists");
};

/* ADD VIDEO */
export const addVideoToPlaylist = (playlistId, videoId) => {
  return axios.post(`/playlists/${playlistId}/video/${videoId}`);
};

/* REMOVE VIDEO */
export const removeVideoFromPlaylist = (playlistId, videoId) => {
  return axios.delete(`/playlists/${playlistId}/video/${videoId}`);
};

/* GET SINGLE PLAYLIST */
export const getPlaylistById = (id) => {
  return axios.get(`/playlists/${id}`);
};

export const deletePlaylist = (playlistId) =>
  axios.delete(`/playlists/${playlistId}`);
