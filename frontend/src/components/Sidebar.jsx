import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProtectedClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/auth");
      return;
    }
    onClose();
  };

  const handleNormalClick = () => {
    onClose();
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <NavLink to="/" end onClick={handleNormalClick}>
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/watch-later"
          onClick={(e) => handleProtectedClick(e, "/watch-later")}
        >
          <span className="nav-icon">🕒</span>
          <span>Watch Later</span>
        </NavLink>

        <NavLink
          to="/playlists"
          onClick={(e) => handleProtectedClick(e, "/playlists")}
        >
          <span className="nav-icon">📚</span>
          <span>Playlists</span>
        </NavLink>

        <NavLink to="/search" onClick={handleNormalClick}>
          <span className="nav-icon">🔎</span>
          <span>Search Channels</span>
        </NavLink>

        <NavLink
          to="/history"
          onClick={(e) => handleProtectedClick(e, "/history")}
        >
          <span className="nav-icon">🧾</span>
          <span>History</span>
        </NavLink>

        <NavLink
          to="/upload"
          onClick={(e) => handleProtectedClick(e, "/upload")}
        >
          <span className="nav-icon">⤴</span>
          <span>Upload</span>
        </NavLink>

        <NavLink
          to="/profile"
          onClick={(e) => handleProtectedClick(e, "/profile")}
        >
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </NavLink>
      </aside>
    </>
  );
};

export default Sidebar;
