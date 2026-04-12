import { useState } from "react";
import client from "../api/client.js";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!video || !thumbnail || !title.trim()) {
      alert("Video, thumbnail and title are required");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", video);       // MUST match backend
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    setLoading(true);
    setProgress(0);

    try {
      await client.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        },
      });

      setMessage("Video uploaded successfully");

      setVideo(null);
      setThumbnail(null);
      setTitle("");
      setDescription("");
      setProgress(0);
    } catch (error) {
      const message = error?.response?.data?.message || "Upload failed";
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1 className="upload-title">Upload Video</h1>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-group">
          <label>Video File *</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />
        </div>

        <div className="upload-group">
          <label>Thumbnail *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            required
          />
        </div>

        <div className="upload-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="upload-group">
          <label>Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* PROGRESS BAR */}
        {loading && (
          <div style={{ marginTop: "12px" }}>
            <div
              style={{
                height: "8px",
                background: "#222",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#9333ea",
                  transition: "width 0.2s",
                }}
              />
            </div>
            <div style={{ fontSize: "13px", marginTop: "6px" }}>
              Uploading… {progress}%
            </div>
          </div>
        )}

        {message && (
          <div style={{ marginTop: "12px", fontSize: "14px" }}>
            {message}
          </div>
        )}

        <button className="upload-btn" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
