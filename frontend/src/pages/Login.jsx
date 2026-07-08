import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/plan");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <span className="badge">✨ AI Powered</span>
        <h1>
          AI Interview <span className="highlight">Coach</span>
        </h1>
        <p>Generate ATS resumes, discover skill gaps, prepare for interviews, and improve your chances of getting hired.</p>
        <ul className="feature-list">
          <li>✓ ATS Optimized Resume Builder</li>
          <li>✓ AI Match Score Analysis</li>
          <li>✓ Personalized Interview Questions</li>
          <li>✓ 7-Day Preparation Roadmap</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to continue your interview journey</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>✉️ Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" required />

          <label>🔒 Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}