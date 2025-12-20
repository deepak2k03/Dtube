import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NavBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/?q=${encodeURIComponent(query)}`);
      setShowMobileSearch(false);
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
        {/* LEFT */}
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="logo" onClick={() => navigate("/")}>
            Dtube
          </div>

          {/* Desktop search */}
          <input
            className="search-input"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* RIGHT */}
        <div className="header-right">
          {/* Mobile search toggle */}
          <button
            className="search-icon"
            onClick={() => setShowMobileSearch((v) => !v)}
            aria-label="Search"
          >
            🔍
          </button>

          {/* Theme toggle */}
          <button
            className="header-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* Avatar */}
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
        </div>
      </header>

      {/* MOBILE SEARCH BOX */}
      {showMobileSearch && (
        <div className="mobile-search-box">
          <input
            className="search-input"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
          />
        </div>
      )}
    </>
  );
};

export default NavBar;
