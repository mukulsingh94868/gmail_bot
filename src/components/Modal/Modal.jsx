"use client";
import { apiRequest } from "@/api/api";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddPositionModal = (props) => {
  const { setShowModal } = props;

  const [positionApplied, setPositionApplied] = useState({
    position: "",
    emailSubject: "",
    emailBody: "",
  });

  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {

      const result = await apiRequest({
        url: "position/positionApply",
        method: "POST",
        body: positionApplied,
      });
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Position added successfully");
        setShowModal(false);
      } else {
        toast.error(result?.message || "Failed to add position");
      }
    } catch (error) {
      alert("Failed to add position: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPositionApplied((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 bg-opacity-90">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg border border-blue-300">
        <h2 className="text-2xl font-extrabold text-blue-800 mb-6 text-center drop-shadow-md">
          🚀 Add New Position
        </h2>
        <form onSubmit={handleAddPosition} className="flex flex-col gap-5">
          <input
            type="text"
            name="position"
            placeholder="Position Title (e.g., Frontend Developer)"
            value={positionApplied.position}
            onChange={handleChange}
            className="p-4 rounded-xl border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400"
            required
          />

          <input
            type="text"
            name="emailSubject"
            placeholder="Email Subject"
            value={positionApplied.emailSubject}
            onChange={handleChange}
            className="p-4 rounded-xl border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400"
            required
          />

          <textarea
            name="emailBody"
            placeholder="Email Body Content..."
            value={positionApplied.emailBody}
            onChange={handleChange}
            className="p-4 rounded-xl border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400 min-h-[120px] resize-none"
            required
          />

          <div className="flex gap-4 justify-end mt-2">
            <button
              type="button"
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400 transition duration-200"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition duration-200"
            >
              Add Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPositionModal;
