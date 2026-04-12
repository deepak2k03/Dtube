import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import client from "../api/client.js";
import VideoCard from "../components/VideoCard.jsx";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await client.get(
          "/videos",
          {
            params: {
              limit: 24,
              ...(query ? { query } : {}),
            },
          }
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
  }, [query]);

  if (loading) return <p>Loading videos...</p>;

  if (!videos.length) {
    return <p>{query ? `No videos found for "${query}"` : "No videos yet. Be the first to upload!"}</p>;
  }

  return (
    <>
      <div className="home-filters">
        {[
          "All",
          "Music",
          "Gaming",
          "Live",
          "Podcasts",
          "Recently uploaded",
          "News",
        ].map((chip, index) => (
          <button key={chip} className={`filter-chip ${index === 0 ? "active" : ""}`}>
            {chip}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </>
  );
};

export default Home;
