import client from "./client.js";

export const getVideos = async (params = {}) => {
  const { data } = await client.get("/videos", { params });
  return data.data;
};

export const getVideoById = async (videoId) => {
  const { data } = await client.get(`/videos/${videoId}`);
  return data.data;
};

export const uploadVideo = async (formData) => {
  const { data } = await client.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

