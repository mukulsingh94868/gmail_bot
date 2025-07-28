"use client";

import React, { useState, useEffect } from "react";
import Faq from "../Faq";
import AddPositionModal from "../Modal/Modal";
import { apiRequest } from "@/api/api";
import toast from "react-hot-toast";

const AddPosition = () => {
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const [history, setHistory] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [positionOptions, setPositionOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");

        const result = await apiRequest({
          url: "http://localhost:5000/api/position/options",
          method: "GET",
          token: token,
        });

        if (result?.statusCode === 200) {
          setPositionOptions(result?.data || []);
        } else {
          console.error("Failed to fetch positions:", result?.message);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchOptions();
  }, []);

  const handlePositionChange = async (e) => {
    const selectedName = e.target.value;
    setPosition(selectedName);

    const selected = positionOptions.find((opt) => opt.name === selectedName);
    if (!selected?._id) return;

    setSelectedPositionId(selected._id);

    try {
      const token = localStorage.getItem("token");

      const result = await apiRequest({
        url: `http://localhost:5000/api/position/postionRecord/${selected._id}`,
        method: "GET",
        token: token,
      });

      if (result?.statusCode === 200) {
        setSelectedData(result?.data || {});
      } else {
        console.error("Failed to fetch position details:", result?.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !selectedData || !position) {
      alert("Please enter email and select position.");
      return;
    }

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(
      selectedData?.[0]?.emailSubject
    )}&body=${encodeURIComponent(selectedData?.[0]?.emailBody)}`;

    window.open(gmailURL, "_blank");
    try {
      const token = localStorage.getItem("token");

      const result = await apiRequest({
        url: "http://localhost:5000/api/apply/position-applied",
        method: "POST",
        body: {
          emailApplied: email,
          positionApplied: position,
          dateAndTime: new Date().toISOString(),
        },
        token: token,
      });

      if (result?.statusCode === 201) {
        toast.success(result?.message || "Successfully Sended Mail");
      } else {
        toast.error(result?.message || "Failed to add position");
      }
    } catch (error) {
      console.error("API error while saving applied position:", error);
    }
  };

  useEffect(() => {
    const fetchAppliedData = async () => {
      try {
        const token = localStorage.getItem("token");

        const result = await apiRequest({
          url: "http://localhost:5000/api/apply/get-position-applied",
          method: "GET",
          token: token,
        });

        if (result?.statusCode === 200) {
          setHistory(result?.data || []);
        } else {
          console.error("Failed to fetch positions:", result?.message);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchAppliedData();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-3xl p-8 flex flex-col items-center">
        <button
          className="mb-6 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          ➕ Add Position
        </button>

        {showModal && (
          <AddPositionModal setShowModal={setShowModal} showModal={showModal} />
        )}

        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          📧 HR Email Bot
        </h1>

        <select
          value={position}
          onChange={handlePositionChange}
          className="w-full mb-4 p-3 rounded-lg border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
        >
          <option value="">Select Position</option>
          {positionOptions.map((pos) => (
            <option key={pos._id} value={pos.name}>
              {pos.name}
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
            <h3 className="text-lg font-bold text-blue-700 mb-3">
              Recent Activity
            </h3>
            <ul className="space-y-2">
              {history?.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white rounded-lg p-3 shadow flex flex-col text-gray-700"
                >
                  <span>
                    <b>To:</b> {item?.emailApplied}
                  </span>
                  <span>
                    <b>Position:</b> {item?.positionApplied}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item?.dateAndTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="w-full">
          <Faq />
        </div>
      </div>
    </div>
  );
};

export default AddPosition;
