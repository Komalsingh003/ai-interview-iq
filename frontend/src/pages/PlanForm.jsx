import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function PlanForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resumeFile && !selfDescription.trim()) {
      setError("Please upload a resume or add a self-description");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (selfDescription) formData.append("selfDescription", selfDescription);
      if (resumeFile) formData.append("resume", resumeFile);

      const { data } = await api.post("/plan/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      navigate(`/results/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate strategy");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <h2>Generating Interview Strategy</h2>
        <p>AI is analyzing your resume, job description and skills...</p>
      </div>
    );
  }

  return (
    <div className="plan-page">
      <h1>
        Create Your Custom <span className="highlight">Interview Plan</span>
      </h1>
      <p className="subtitle">Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="plan-form">
        <div className="col">
          <label>
            🎯 Target Job Description <span className="required">REQUIRED</span>
          </label>
          <textarea
            maxLength={5000}
            placeholder={`Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
          <span className="char-count">{jobDescription.length} / 5000 chars</span>
        </div>

        <div className="col">
          <label>👤 Your Profile</label>
          <div className="upload-box">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            <p>Click to upload or drag & drop</p>
            <span>PDF or DOCX (Max 5MB)</span>
            {resumeFile && <p className="filename">{resumeFile.name}</p>}
          </div>

          <div className="divider">OR</div>

          <label>Quick Self-Description</label>
          <textarea
            placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
            value={selfDescription}
            onChange={(e) => setSelfDescription(e.target.value)}
          />

          <div className="hint">Either a Resume or a Self Description is required to generate a personalized plan.</div>
        </div>
      </form>

      <button className="generate-btn" onClick={handleSubmit} disabled={loading}>
        ⭐ Generate My Interview Strategy
      </button>
    </div>
  );
}
