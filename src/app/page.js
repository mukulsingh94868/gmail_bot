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
        <div style={{ marginTop: 24, textAlign: "left" }}>
          <h3
            style={{
              fontSize: 16,
              color: "#0072ee",
              marginBottom: 8,
            }}
          >
            Recent Activity
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {history?.map((item, idx) => (
              <li
                key={idx}
                style={{
                  background: "rgba(0,114,238,0.07)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  marginBottom: 6,
                  fontSize: 14,
                  color: "#171717",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxShadow: "0 1px 4px #0072ee11",
                }}
              >
                <span>
                  <b>To:</b> {item?.email}
                </span>
                <span>
                  <b>Position:</b> {item?.position}
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  {item?.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HRBotApp;
