"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { handleJobPost } from "@/actions/addJobPostActions";
import toast from "react-hot-toast";
import { BriefcaseBusiness } from "lucide-react";
import ModalShell from "../ui/ModalShell";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[260px] items-center justify-center bg-brand-50/50">
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
    <ModalShell
      title="New Job Post"
      description="Create a job description for candidates"
      icon={BriefcaseBusiness}
      onClose={() => setShowJobModal(false)}
      maxWidth="sm:max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jd" className="rl-label">Job Description</label>
          <div className="rl-editor overflow-hidden rounded-xl border border-brand-100 bg-white transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15">
            <ReactQuill
              id="jd"
              name="JD"
              value={formData.JD}
              onChange={handleDescriptionChange}
              placeholder="Write the job description... Include the HR email so candidates can apply."
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
          <button type="button" className="rl-btn-outline" onClick={() => setShowJobModal(false)}>
            Cancel
          </button>
          <button type="submit" className="rl-btn-primary">
            Post Job
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default JobPost;
