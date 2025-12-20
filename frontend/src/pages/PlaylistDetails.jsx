import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylist = async () => {
    try {
      const res = await axios.get(`/playlists/${playlistId}`);
      setPlaylist(res.data.data);
    } catch (err) {
      console.error("Fetch playlist failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  /* ================= REMOVE VIDEO ================= */
  const removeVideo = async (videoId) => {
    const ok = window.confirm("Remove this video from playlist?");
    if (!ok) return;

    try {
      await axios.delete(
        `/playlists/${playlistId}/video/${videoId}`
      );
      fetchPlaylist();
    } catch (err) {
      console.error("Remove video failed", err);
    }
  };

  /* ================= DELETE PLAYLIST ================= */
  const deletePlaylist = async () => {
    const ok = window.confirm("Delete this playlist permanently?");
    if (!ok) return;

    try {
      await axios.delete(`/playlists/${playlistId}`);
      navigate("/playlists");
    } catch (err) {
      console.error("Delete playlist failed", err);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!playlist) return <p>Playlist not found</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2>{playlist.name}</h2>

        <button
          onClick={deletePlaylist}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Delete Playlist
        </button>
      </div>

      {/* VIDEOS */}
      {playlist.videos.length === 0 ? (
        <p>No videos in this playlist</p>
      ) : (
        playlist.videos.map((v) => (
          <div
            key={v._id}
            style={{
              display: "flex",
              gap: 12,
              padding: 10,
              border: "1px solid var(--border)",
              borderRadius: 10,
              marginBottom: 12,
              alignItems: "center",
            }}
          >
            <img
              src={v.thumbnail}
              alt=""
              style={{
                width: 160,
                height: 90,
                borderRadius: 8,
                cursor: "pointer",
              }}
              onClick={() => navigate(`/video/${v._id}`)}
            />

            <div style={{ flex: 1 }}>
              <h4
                style={{ margin: "0 0 6px", cursor: "pointer" }}
                onClick={() => navigate(`/video/${v._id}`)}
              >
                {v.title}
              </h4>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
                {v.owner?.username}
              </p>
            </div>

            <button
              onClick={() => removeVideo(v._id)}
              style={{
                background: "transparent",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistDetails;
