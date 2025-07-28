"use client";

import React, { useState, useEffect } from "react";
import Faq from "../Faq";
import AddPositionModal from "../Modal/Modal";
import { apiRequest } from "@/api/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const AddPosition = () => {
  const router = useRouter();
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
          token,
        });
        if (result?.statusCode === 200) {
          setPositionOptions(result?.data || []);
        } else {
          toast.error(result?.message || "Failed to fetch positions");
        }
      } catch (err) {
        toast.error("Network error fetching positions");
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
        token,
      });
      if (result?.statusCode === 200) {
        setSelectedData(result?.data || {});
      } else {
        toast.error(result?.message || "Failed to fetch position data");
      }
    } catch (err) {
      toast.error("Error loading position data");
    }
  };

  const handleSendEmail = async () => {
    if (!email || !selectedData || !position) {
      toast.error("Please enter email and select position.");
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
        token,
      });

      if (result?.statusCode === 201) {
        toast.success(result?.message || "Successfully sent email");
      } else {
        toast.error(result?.message || "Failed to record position");
      }
    } catch (error) {
      toast.error("Error recording applied position");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    router.push("/");
  };

  useEffect(() => {
    const fetchAppliedData = async () => {
      try {
        const token = localStorage.getItem("token");
        const result = await apiRequest({
          url: "http://localhost:5000/api/apply/get-position-applied",
          method: "GET",
          token,
        });
        if (result?.statusCode === 200) {
          setHistory(result?.data || []);
        } else {
          toast.error(result?.message || "Failed to fetch history");
        }
      } catch (err) {
        toast.error("Error loading history");
      }
    };
    fetchAppliedData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-indigo-100 to-blue-200 px-4 py-6">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800">📧 HR Email Bot</h1>
        <div className="flex gap-3">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
            onClick={() => setShowModal(true)}
          >
            ➕ Add Position
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl shadow"
            onClick={() => router.push("/template-listing")}
          >
            📋 Templates Listing
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl shadow"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {showModal && (
        <AddPositionModal setShowModal={setShowModal} showModal={showModal} />
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-5">
        <select
          value={position}
          onChange={handlePositionChange}
          className="w-full p-3 text-black rounded-lg border border-blue-300 bg-blue-50 focus:ring-2 focus:ring-blue-500"
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
          className="w-full text-black p-3 rounded-lg border border-blue-300 bg-blue-50 focus:ring-2 focus:ring-blue-500"
        />

        {/* {selectedData && (
          <div className="bg-blue-100 rounded-lg p-4">
            <p className="font-semibold text-blue-700">📎 Resume:</p>
            <a
              href={selectedData.resume}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Download Resume
            </a>
          </div>
        )} */}

        <button
          onClick={handleSendEmail}
          className="w-full py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800"
        >
          ✉️ Send Email
        </button>

        {history?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">
              📜 Recent Activity
            </h3>
            <ul className="space-y-3">
              {history?.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white p-4 rounded-lg text-black shadow-md border border-blue-100"
                >
                  <p>
                    <b>To:</b> {item.emailApplied}
                  </p>
                  <p>
                    <b>Position:</b> {item.positionApplied}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.dateAndTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPosition;
