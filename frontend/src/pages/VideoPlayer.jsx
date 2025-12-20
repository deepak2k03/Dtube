import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  /* ===== PLAYLIST ===== */
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  /* ================= FETCH VIDEO ================= */
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/videos/${videoId}`);
        const data = res.data.data;

        setVideo(data);
        setLiked(Boolean(data.isLiked));
        setLikesCount(data.likesCount ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [videoId]);

  /* ================= FETCH RECOMMENDED ================= */
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get("/videos?limit=8");
        setRecommended(res.data.data.docs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommended();
  }, []);

  /* ================= LIKE ================= */
  const handleLike = async () => {
    if (!isAuthenticated) return navigate("/auth");

    try {
      const res = await axios.post(`/likes/video/${videoId}`);
      setLiked(res.data.data.liked);
      setLikesCount(res.data.data.likesCount);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= WATCH LATER ================= */
  const handleWatchLater = async () => {
    if (!isAuthenticated) return navigate("/auth");

    try {
      await axios.post(`/watch-later/${videoId}`);
      alert("Added to Watch Later");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PLAYLIST ================= */
  const openPlaylistModal = async () => {
    if (!isAuthenticated) return navigate("/auth");

    try {
      const res = await axios.get("/playlists");
      setPlaylists(res.data.data || []);
      setShowPlaylistModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlaylist = async (playlistId, exists) => {
    try {
      if (exists) {
        await axios.delete(`/playlists/${playlistId}/video/${videoId}`);
      } else {
        await axios.post(`/playlists/${playlistId}/video/${videoId}`);
      }

      // refresh playlists
      const res = await axios.get("/playlists");
      setPlaylists(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= COMMENT ================= */
  const handleComment = async () => {
    if (!isAuthenticated) return navigate("/auth");
    if (!commentText.trim()) return;

    try {
      const res = await axios.post(`/comments/${videoId}`, {
        content: commentText,
      });
      setComments((prev) => [res.data.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Delete this video permanently?")) return;

    try {
      await axios.delete(`/videos/${videoId}`);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!video) return <p style={{ padding: 20 }}>Video not found</p>;

  return (
    <>
      <div className="video-page">
        {/* LEFT */}
        <div className="video-main">
          <video className="video-player" src={video.videoFile} controls />

          <h2 className="video-title">{video.title}</h2>

          <div className="video-actions">
            <div className="video-owner">
              <img
                src={video.owner.avatar}
                alt=""
                className="video-avatar"
              />
              <span>{video.owner.username}</span>
            </div>

            <div className="action-buttons">
              <button
                className={`like-btn ${liked ? "liked" : ""}`}
                onClick={handleLike}
              >
                👍 {likesCount}
              </button>

              <button className="like-btn" onClick={handleWatchLater}>
                ⏱ Watch Later
              </button>

              <button className="like-btn" onClick={openPlaylistModal}>
                ➕ Playlist
              </button>

              {user?._id === video.owner._id && (
                <button className="like-btn" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <p className="video-description">{video.description}</p>

          {/* COMMENTS */}
          <div className="comments-section">
            <h3>Comments</h3>

            {isAuthenticated && (
              <div className="comment-input-box">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={handleComment}>Post</button>
              </div>
            )}

            {comments.map((c) => (
              <div key={c._id} className="comment-item">
                <strong>{c.owner.username}</strong>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <aside className="video-recommended">
          <h3>Recommended</h3>

          {recommended
            .filter((v) => v._id !== videoId)
            .map((v) => (
              <div
                key={v._id}
                className="recommended-item"
                onClick={() => navigate(`/video/${v._id}`)}
              >
                <img src={v.thumbnail} alt="" />
                <p>{v.title}</p>
              </div>
            ))}
        </aside>
      </div>

      {/* PLAYLIST MODAL */}
      {showPlaylistModal && (
        <div
          className="playlist-overlay"
          onClick={() => setShowPlaylistModal(false)}
        >
          <div
            className="playlist-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="playlist-title">Save to playlist</h3>

            {playlists.length === 0 ? (
              <p className="playlist-empty">No playlists found</p>
            ) : (
              <div className="playlist-list">
                {playlists.map((p) => {
                  const exists = p.videos?.includes(videoId);

                  return (
                    <label key={p._id} className="playlist-row">
                      <input
                        type="checkbox"
                        checked={exists}
                        onChange={() =>
                          togglePlaylist(p._id, exists)
                        }
                      />
                      <span>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <button
              className="playlist-close-btn"
              onClick={() => setShowPlaylistModal(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
