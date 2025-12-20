import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/videos"
        );

        // ✅ aggregatePaginate returns docs
        const docs = res.data?.data?.docs;

        if (Array.isArray(docs)) {
          setVideos(docs);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("Failed to fetch videos", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  if (!videos.length) {
    return <p>No videos yet. Be the first to upload!</p>;
  }

  return (
    <div className="video-grid">
      {videos.map((video) => (
        <Link
          key={video._id}
          to={`/video/${video._id}`}
          className="video-card"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="video-thumb"
          />

          <div className="video-info">
            <h4 className="video-title">{video.title}</h4>
            <p className="video-meta">
              {video.owner?.username}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;
