import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css"

const Auth = () => {
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || "login");

  useEffect(() => {
    if (location.state?.mode) {
      setMode(location.state.mode);
    }
  }, [location.state]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (mode === "login") {
      const result = await login({
        email: form.email || undefined,
        username: form.username || undefined,
        password: form.password,
      });
      if (result.ok) {
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo, { replace: true });
      } else {
        setMessage(result.message);
      }
      return;
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("password", form.password);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    const result = await register(formData);
    if (result.ok) {
      const loginResult = await login({
        email: form.email,
        password: form.password,
      });
      if (loginResult.ok) {
        navigate("/", { replace: true });
      } else {
        setMessage(loginResult.message);
      }
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to continue to Dtube"
            : "Join Dtube to start watching videos"}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  className="form-input"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {mode === "register" && (
            <>
              <div className="form-group">
                <label className="form-label">Avatar *</label>
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cover Image (optional)</label>
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                />
              </div>
            </>
          )}

          {message && (
            <div
              style={{
                padding: "0.75rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#fca5a5",
                fontSize: "0.9rem",
              }}
            >
              {message}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log in"
              : "Sign up"}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="auth-toggle-link"
                onClick={() => setMode("register")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="auth-toggle-link"
                onClick={() => setMode("login")}
              >
                Log in
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
