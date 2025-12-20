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
        {/* HOME */}
        <NavLink to="/" end onClick={handleNormalClick}>
          Home
        </NavLink>

        {/* WATCH LATER */}
        <NavLink
          to="/watch-later"
          onClick={(e) => handleProtectedClick(e, "/watch-later")}
        >
          Watch Later
        </NavLink>

        {/* PLAYLISTS */}
        <NavLink
          to="/playlists"
          onClick={(e) => handleProtectedClick(e, "/playlists")}
        >
          Playlists
        </NavLink>

        {/* LIKED */}
        <NavLink
          to="/liked"
          onClick={(e) => handleProtectedClick(e, "/liked")}
        >
          Liked Videos
        </NavLink>

        {/* HISTORY */}
        <NavLink
          to="/history"
          onClick={(e) => handleProtectedClick(e, "/history")}
        >
          History
        </NavLink>

        {/* UPLOAD */}
        <NavLink
          to="/upload"
          onClick={(e) => handleProtectedClick(e, "/upload")}
        >
          Upload
        </NavLink>

        {/* MY CONTENT */}
        <NavLink
          to="/my-videos"
          onClick={(e) => handleProtectedClick(e, "/my-videos")}
        >
          My Content
        </NavLink>
      </aside>
    </>
  );
};

export default Sidebar;
