import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";

const Channel = () => {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState("");

  const fetchChannel = async () => {
    try {
      const res = await axios.get(`/users/c/${username}`);
      setChannel(res.data.data);
      setError("");
    } catch {
      setError("Unable to load channel");
      setChannel(null);
    }
  };

  const toggleSubscribe = async () => {
    await axios.post(`/subscriptions/${channel._id}`);
    fetchChannel();
  };

  useEffect(() => {
    fetchChannel();
  }, [username]);

  if (error) return <p>{error}</p>;
  if (!channel) return <p>Loading channel...</p>;

  return (
    <div className="channel-page">
      {channel.coverImage ? <img src={channel.coverImage} className="channel-cover" alt="cover" /> : null}
      <img src={channel.avatar} width={80} alt={channel.username} />

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
