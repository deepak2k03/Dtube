import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const WatchLater = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchLater = async () => {
      const res = await axios.get("/watch-later");
      setVideos(res.data.data || []);
    };

    fetchWatchLater();
  }, []);

  if (!videos.length) return <p>No videos in Watch Later</p>;

  return (
    <div className="video-grid">
      {videos.map((v) => (
        <div
          key={v._id}
          className="video-card"
          onClick={() => navigate(`/video/${v._id}`)}
        >
          <img src={v.thumbnail} className="video-thumb" />
          <p>{v.title}</p>
        </div>
      ))}
    </div>
  );
};

export default WatchLater;
