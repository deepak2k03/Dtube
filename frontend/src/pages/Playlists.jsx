import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPlaylist,
  getMyPlaylists,
  deletePlaylist,
} from "../utils/playlistApi.js";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH PLAYLISTS ================= */
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await getMyPlaylists();
      setPlaylists(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  /* ================= CREATE PLAYLIST ================= */
  const handleCreate = async () => {
    if (!name.trim() || creating) return;

    try {
      setCreating(true);
      setError("");

      const res = await createPlaylist(name);

      // ✅ optimistic update
      setPlaylists((prev) => [res.data.data, ...prev]);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading playlists...</p>;
  }

  const handleDeletePlaylist = async (playlistId) => {
    const ok = window.confirm("Delete this playlist permanently?");
    if (!ok) return;

    try {
      await deletePlaylist(playlistId);
      fetchPlaylists(); // refresh list
    } catch (err) {
      console.error("Delete playlist failed", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16 }}>
      <h2>Your Playlists</h2>

      {/* CREATE */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={handleCreate} disabled={creating}>
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

      {/* LIST */}
      {playlists.length === 0 ? (
        <p>No playlists yet</p>
      ) : (
        playlists.map((p) => (
          <div
            key={p._id}
            style={{
              padding: 14,
              border: "1px solid var(--border)",
              borderRadius: 10,
              marginBottom: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT */}
            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/playlists/${p._id}`)}
            >
              <strong>{p.name}</strong>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
                {p.videos?.length || 0} videos
              </p>
            </div>

            {/* RIGHT */}
            <button
              onClick={() => handleDeletePlaylist(p._id)}
              style={{
                background: "transparent",
                border: "1px solid #ff4d4f",
                color: "#ff4d4f",
                padding: "6px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Playlists;
