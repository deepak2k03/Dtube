import { useEffect, useState } from "react";
import client from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import VideoCard from "../components/VideoCard.jsx";

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await client.get("/users/history");
        setHistory(data.data || []);
        setStatus("done");
      } catch (error) {
        console.error("Failed to load history", error);
        setStatus("error");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "1.5rem", fontSize: "1.5rem", fontWeight: 600 }}>
        Watch History
      </h1>

      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          Loading history…
        </div>
      )}
      {status === "error" && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#fca5a5" }}>
          Unable to fetch history right now.
        </div>
      )}

      {status === "done" && history.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
          No watch history yet. Watch some videos and come back.
        </div>
      )}

      <div className="video-grid">
        {history.map((item) => (
          <VideoCard
            key={item._id}
            video={{
              ...item,
              _id: item._id,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default History;
