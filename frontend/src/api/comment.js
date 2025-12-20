import client from "./client.js";

export const getVideoComments = async (videoId, params = {}) => {
  const { data } = await client.get(`/comments/v/${videoId}`, { params });
  return data.data;
};

export const addComment = async (videoId, content) => {
  const { data } = await client.post(`/comments/v/${videoId}`, { content });
  return data.data;
};

export const updateComment = async (commentId, content) => {
  const { data } = await client.patch(`/comments/c/${commentId}`, { content });
  return data.data;
};

export const deleteComment = async (commentId) => {
  const { data } = await client.delete(`/comments/c/${commentId}`);
  return data.data;
};

