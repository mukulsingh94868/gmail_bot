"use client";

import React, { useState } from "react";
import { ChevronLeft, Calendar } from "lucide-react";
import RecruiterHeader from "../RecruiterHeader/RecruiterHeader";
import { useRouter } from "next/navigation";

const JobDetailPageByRecruiter = ({ JobDataById, fetchJobPostData }) => {
  const router = useRouter();
  const [showJobModal, setShowJobModal] = useState(false);

  if (!JobDataById) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <RecruiterHeader showJobModal={showJobModal} setShowJobModal={setShowJobModal} />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <button
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={12} />
              Posted on{" "}
              {new Date(JobDataById.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>

            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{ __html: JobDataById.JD }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPageByRecruiter;
