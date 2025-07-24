"use client";
import { useState } from "react";
import jobApplicationData from "./constants/data";

export default function Home() {
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const selectedData = jobApplicationData[position];

  const handleSendEmail = () => {
    if (!email || !selectedData) {
      alert("Please enter email and select position.");
      return;
    }

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(selectedData.subject)}&body=${encodeURIComponent(
      selectedData.body
    )}`;

    window.open(gmailURL, "_blank");
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
        {Object.keys(jobApplicationData).map((pos) => (
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
    </div>
  );
}
