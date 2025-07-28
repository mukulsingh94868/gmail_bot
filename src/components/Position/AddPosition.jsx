"use client";

import React, { useState } from "react";
import Faq from "../Faq";
import jobApplicationData from "../../../constants/data";
import AddPositionModal from "../Modal/Modal";

const AddPosition = () => {
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
  const [showModal, setShowModal] = useState(false);
  // const [newPos, setNewPos] = useState("");
  // const [newSubject, setNewSubject] = useState("");
  // const [newBody, setNewBody] = useState("");
  const [positions, setPositions] = useState(jobApplicationData);

  const selectedData = positions[position];

  const handleSendEmail = () => {
    if (!email || !selectedData) {
      alert("Please enter email and select position.");
      return;
    }

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(
      selectedData?.subject
    )}&body=${encodeURIComponent(selectedData?.body)}`;

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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-3xl p-8 flex flex-col items-center">
        {/* Add Position Button */}
        <button
          className="mb-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Position
        </button>

        {/* Modal */}
        {showModal && (
          <AddPositionModal
            setShowModal={setShowModal}
            showModal={showModal}
          />
        )}


        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">📧 HR Email Bot</h1>

        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
        >
          <option value="">Select Position</option>
          {Object.keys(positions)?.map((pos) => (
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
          className="w-full mb-4 p-3 rounded-lg border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
        />

        {selectedData && (
          <div className="w-full flex flex-col items-start bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
            <span className="text-blue-700 font-semibold mb-2">📎 Resume:</span>
            <a
              href={selectedData.resume}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Download Resume
            </a>
          </div>
        )}

        <button
          onClick={handleSendEmail}
          className="w-full mt-2 mb-6 p-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          ✉️ Send Email
        </button>

        {history?.length > 0 && (
          <div className="w-full bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
            <h3 className="text-lg font-bold text-blue-700 mb-3">Recent Activity</h3>
            <ul className="space-y-2">
              {history?.map((item, idx) => (
                <li key={idx} className="bg-white rounded-lg p-3 shadow flex flex-col text-gray-700">
                  <span><b>To:</b> {item?.email}</span>
                  <span><b>Position:</b> {item?.position}</span>
                  <span className="text-xs text-gray-400">{item?.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQ/Help Section */}
        <div className="w-full">
          <Faq />
        </div>
      </div>
    </div>
  );
};

export default AddPosition;
