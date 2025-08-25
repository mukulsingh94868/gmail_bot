"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { handleJobPost } from "@/actions/addJobPostActions";
import toast from "react-hot-toast";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Text Editor...</p>,
});

const JobPost = ({ setShowJobModal }) => {
  const [formData, setFormData] = useState({
    JD: "",
  });

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, JD: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = formData;

      console.log("Payload:", payload);
      const result = await handleJobPost("jd/createJd", payload);

      if (result?.statusCode === 201) {
        toast.success(result?.message || "Job posted successfully");
        setTimeout(() => {
          setShowJobModal(false);
        }, 1000);
      } else {
        toast.error(result?.message || "Failed to post job");
      }

      console.log("result", result);
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 bg-opacity-90 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl p-6 sm:p-10 border border-blue-300 transition-all duration-300 ease-in-out">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">
          🚀 Add Job Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="text-editor-wrapper">
              <ReactQuill
                id="jd"
                name="JD"
                value={formData.JD}
                onChange={handleDescriptionChange}
                placeholder="Enter the Job Description..."
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
              onClick={() => setShowJobModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow transition"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPost;
