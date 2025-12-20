import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    if (!views) return "0 Views";
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M Views`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K Views`;
    return `${views} Views`;
  };

  const formatTimeAgo = (date) => {
    if (!date) return "18 hours ago";
    const now = new Date();
    const videoDate = new Date(date);
    const diffMs = now - videoDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return videoDate.toLocaleDateString();
  };

  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <img
        src={video.thumbnail || "/placeholder.jpg"}
        alt={video.title}
        className="video-thumbnail"
        loading="lazy"
      />
      <div className="video-info">
        <img
          src={video.owner?.avatar || "/default-avatar.png"}
          alt={video.owner?.fullName}
          className="video-avatar"
        />
        <div className="video-details">
          <h3 className="video-title">{video.title}</h3>
          <p className="video-meta">
            {formatViews(video.views)} • {formatTimeAgo(video.createdAt)}
          </p>
          <p className="video-creator">
            {video.owner?.fullName || video.owner?.username || "Unknown"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
