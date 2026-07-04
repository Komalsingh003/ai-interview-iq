import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function Results() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/plan/${id}`)
      .then(({ data }) => setReport(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load report"));
  }, [id]);

  const downloadPdf = async () => {
    const res = await api.get(`/plan/${id}/pdf`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "interview-strategy.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (error) return <div className="results-page"><p className="error">{error}</p></div>;
  if (!report) return <div className="results-page"><p>Loading...</p></div>;

  return (
    <div className="results-page">
      <h1>Your Interview Strategy</h1>

      <div className="score-card">
        <span>Match Score</span>
        <strong>{report.matchScore}/100</strong>
      </div>

      <section>
        <h2>Skill Gaps</h2>
        <ul>{report.skillGaps.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section>
        <h2>Technical Questions</h2>
        <ul>{report.technicalQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
      </section>

      <section>
        <h2>Behavioral Questions</h2>
        <ul>{report.behavioralQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
      </section>

      <section>
        <h2>7-Day Roadmap</h2>
        {report.roadmap.map((r) => (
          <div key={r.day} className="roadmap-day">
            <h3>Day {r.day}: {r.focus}</h3>
            <ul>{r.tasks.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Resume Suggestions</h2>
        <ul>{report.resumeSuggestions.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <button onClick={downloadPdf}>Download PDF Report</button>
    </div>
  );
}
