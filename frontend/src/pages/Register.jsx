import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [username, setUsername] = useState("");
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
      const { data } = await api.post("/auth/register", { username, email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <span className="badge">🚀 AI Interview Platform</span>
        <h1>
          Start Your <span className="highlight">AI Career Journey</span>
        </h1>
        <p>Create your account and unlock personalized interview preparation, ATS-friendly resume generation, AI-powered career insights, and interview strategy reports tailored to your dream job.</p>
        <ul className="feature-list">
          <li>✓ Personalized Interview Reports</li>
          <li>✓ ATS Optimized Resume Builder</li>
          <li>✓ Skill Gap Analysis & Roadmap</li>
        </ul>
      </div>

      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join thousands of candidates improving their interview performance.</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>👤 Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />

          <label>✉️ Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" required />

          <label>🔒 Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required minLength={6} />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}