import client from "./client.js";

export const toggleSubscription = async (channelId) => {
  const { data } = await client.post(`/subscriptions/c/${channelId}`);
  return data.data;
};

export const getChannelSubscribers = async (channelId) => {
  const { data } = await client.get(`/subscriptions/c/${channelId}/subscribers`);
  return data.data;
};

export const getSubscribedChannels = async () => {
  const { data } = await client.get("/subscriptions/u/subscribed");
  return data.data;
};

