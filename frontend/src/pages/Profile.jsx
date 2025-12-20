import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
        Loading your profile...
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileForm);
    setMessage(result.ok ? "Profile updated successfully." : result.message);
    setTimeout(() => setMessage(""), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const result = await changePassword(passwordForm);
    setMessage(result.ok ? "Password changed successfully." : result.message);
    if (result.ok) {
      setPasswordForm({ currentPassword: "", newPassword: "" });
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "2rem", fontSize: "1.5rem", fontWeight: 600 }}>
        Profile Settings
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div style={{ background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <img
              src={user.avatar}
              alt={user.fullName}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                {user.fullName}
              </h2>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                @{user.username}
              </p>
            </div>
          </div>

          {user.coverImage && (
            <div
              style={{
                width: "100%",
                height: "120px",
                borderRadius: "8px",
                backgroundImage: `url(${user.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: "1.5rem",
              }}
            />
          )}
        </div>

        <form
          style={{ background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}
          onSubmit={handleProfileSubmit}
        >
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>
            Account Details
          </h3>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              name="fullName"
              value={profileForm.fullName}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              required
            />
          </div>
          <button className="auth-submit" type="submit" style={{ width: "100%" }}>
            Save Changes
          </button>
        </form>

        <form
          style={{ background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)" }}
          onSubmit={handlePasswordSubmit}
        >
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>
            Change Password
          </h3>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Current Password</label>
            <input
              className="form-input"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">New Password</label>
            <input
              className="form-input"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              required
            />
          </div>
          <button className="auth-submit" type="submit" style={{ width: "100%", background: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
            Update Password
          </button>
        </form>
      </div>

      {message && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "0.75rem 1rem",
            background: message.includes("successfully") ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
            border: `1px solid ${message.includes("successfully") ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            borderRadius: "8px",
            color: message.includes("successfully") ? "#86efac" : "#fca5a5",
            fontSize: "0.9rem",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Profile;
