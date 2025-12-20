import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

const Channel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);

  const fetchChannel = async () => {
    const res = await axios.get(`/users/channel/${username}`);
    setChannel(res.data.data);
  };

  const toggleSubscribe = async () => {
    await axios.post(`/subscriptions/${channel._id}`);
    fetchChannel();
  };

  useEffect(() => {
    fetchChannel();
  }, [username]);

  if (!channel) return null;

  return (
    <div className="content-area">
      <img src={channel.coverImage} width="100%" />
      <img src={channel.avatar} width={80} />

      <h2>{channel.fullName}</h2>
      <p>@{channel.username}</p>
      <p>{channel.subscribersCount} subscribers</p>

      <button onClick={toggleSubscribe}>
        {channel.isSubscribed ? "Unsubscribe" : "Subscribe"}
      </button>
    </div>
  );
};

export default Channel;
