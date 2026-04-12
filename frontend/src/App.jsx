import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import History from "./pages/History";
import VideoPlayer from "./pages/VideoPlayer";
import ProtectedRoute from "./components/ProtectedRoute";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Channel from "./pages/Channel";
import Playlists from "./pages/Playlists";
import PlaylistDetails from "./pages/PlaylistDetails";
import WatchLater from "./pages/WatchLater";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");

  // ✅ SIDEBAR STATE (THIS WAS MISSING)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <NavBar onMenuClick={() => setSidebarOpen(true)} />

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />

            <Route path="/video/:videoId" element={<VideoPlayer key={location.pathname} />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<Search />} />
            <Route path="/channel/:username" element={<Channel />} />
            <Route path="/watch-later" element={<ProtectedRoute><WatchLater /></ProtectedRoute>} />
            <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
            <Route path="/playlists/:playlistId" element={<ProtectedRoute><PlaylistDetails /></ProtectedRoute>} />


            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
