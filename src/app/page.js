"use client";
import { useState } from "react";
import jobApplicationData from "./constants/data";

const HRBotApp = () => {
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [history, setHistory] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("hrbot-history");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const selectedData = jobApplicationData[position];

  const handleSendEmail = () => {
    if (!email || !selectedData) {
      alert("Please enter email and select position.");
      return;
    }

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(
      selectedData?.subject)}&body=${encodeURIComponent(selectedData?.body)}`;

    window.open(gmailURL, "_blank");

    const newEntry = {
      email,
      position,
      date: new Date().toLocaleString(),
    };
    const newHistory = [newEntry, ...history]?.slice(0, 5); // keep last 5
    setHistory(newHistory);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("hrbot-history", JSON.stringify(newHistory));
      } catch { }
    }
  };

  return (
    <div className="app-container">
      <h1>📧 HR Email Bot</h1>

      <select
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="dropdown"
      >
        <option value="">Select Position</option>
        {Object.keys(jobApplicationData)?.map((pos) => (
          <option key={pos} value={pos}>
            {pos}
          </option>
        ))}
      </select>

      <input
        type="email"
        placeholder="Paste HR Email here"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="email-input"
      />

      {selectedData && (
        <div className="resume-download">
          📎 Resume:
          <a
            href={selectedData.resume}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume
          </a>
        </div>
      )}

      <button onClick={handleSendEmail} className="send-btn">
        ✉️ Send Email
      </button>

      {history?.length > 0 && (
        <div className="recent-activity">
          <h3 className="recent-activity-title">Recent Activity</h3>
          <ul className="recent-activity-list">
            {history?.map((item, idx) => (
              <li key={idx} className="recent-activity-item">
                <span><b>To:</b> {item?.email}</span>
                <span><b>Position:</b> {item?.position}</span>
                <span className="recent-activity-date">{item?.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* FAQ/Help Section */}
      <div className="faq-section">
        <details className="faq-details">
          <summary className="faq-summary">❓ FAQ / Help</summary>
          <div className="faq-content">
            <b>How do I use the HR Email Bot?</b>
            <ul className="faq-list">
              <li>Select the job position from the dropdown.</li>
              <li>Paste the HR's email address.</li>
              <li>Click "Send Email" to open Gmail with a pre-filled message.</li>
              <li>Download your resume if needed.</li>
            </ul>
            <b>What is Recent Activity?</b>
            <div className="faq-answer">Shows the last 5 emails you sent using this bot.</div>
            <b>Is my data safe?</b>
            <div className="faq-answer">Your email history is stored only in your browser and never sent to any server.</div>
            <b>Need more help?</b>
            <div className="faq-answer">Contact your developer or HR for further assistance.</div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default HRBotApp;
