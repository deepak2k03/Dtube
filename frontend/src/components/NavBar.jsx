import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NavBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      <header className="top-header">
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="logo" onClick={() => navigate("/")}>
            <span className="logo-mark">▶</span>
            <span className="logo-text">Deetube</span>
          </div>

          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button className="search-submit" aria-label="Search" onClick={submitSearch}>
              🔍
            </button>
          </div>
        </div>

        <div className="header-right">
          <button className="create-btn" onClick={() => navigate("/upload")}>Create</button>

          <button
            className="header-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {isAuthenticated && (
            <div className="avatar-wrapper">
              <img
                src={user?.avatar || "/avatar-placeholder.png"}
                alt={user?.username || "user"}
                className="avatar"
                onClick={() => setOpen((v) => !v)}
              />

              {open && (
                <div className="avatar-menu">
                  <div
                    className="avatar-menu-item"
                    onClick={() => {
                      setOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </div>

                  <div
                    className="avatar-menu-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <button className="signin-btn" onClick={() => navigate("/auth")}>Sign in</button>
          )}
        </div>
      </header>
    </>
  );
};

export default NavBar;
