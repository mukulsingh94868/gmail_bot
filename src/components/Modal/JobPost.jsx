"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { handleJobPost } from "@/actions/addJobPostActions";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[200px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
      <span className="text-sm text-slate-400">Loading editor...</span>
    </div>
  ),
});

const JobPost = ({ setShowJobModal }) => {
  const [formData, setFormData] = useState({ JD: "" });

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, JD: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await handleJobPost("jd/createJd", formData);
      if (result?.statusCode === 201) {
        toast.success(result?.message || "Job posted successfully");
        setTimeout(() => setShowJobModal(false), 1000);
      } else {
        toast.error(result?.message || "Failed to post job");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowJobModal(false)}
      />
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Job Post</h2>
            <p className="mt-0.5 text-sm text-slate-500">Create a job description for candidates</p>
          </div>
          <button
            onClick={() => setShowJobModal(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Job Description</label>
            <div className="text-editor-wrapper rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
              <ReactQuill
                id="jd"
                name="JD"
                value={formData.JD}
                onChange={handleDescriptionChange}
                placeholder="Write the job description..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={() => setShowJobModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPost;
