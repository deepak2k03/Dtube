import client from "./client.js";

export const getVideoComments = async (videoId, params = {}) => {
  const { data } = await client.get(`/comments/${videoId}`, { params });
  return data.data;
};

export const addComment = async (videoId, content) => {
  const { data } = await client.post(`/comments/${videoId}`, { content });
  return data.data;
};

