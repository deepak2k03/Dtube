import { useEffect, useState } from "react";
import axios from "../utils/axios";
import VideoCard from "../components/VideoCard.jsx";

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        const res = await axios.get("/watch-later");
        setVideos(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, []);

  if (loading) return <p>Loading Watch Later...</p>;
  if (!videos.length) return <p>No videos in Watch Later</p>;

  return (
    <div className="video-grid">
      {videos.map((v) => <VideoCard key={v._id} video={v} />)}
    </div>
  );
};

export default WatchLater;
