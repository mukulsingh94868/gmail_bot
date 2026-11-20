"use client";

import React from "react";
import { Briefcase, Calendar, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const JobDetailPageByRecruiter = ({ JobDataById }) => {
  const router = useRouter();

  if (!JobDataById) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <button
        className="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-700"
        onClick={() => router.back()}
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <article className="rl-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-brand-100 bg-linear-to-r from-brand-50 to-white p-5 sm:p-7">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-800 to-brand-500 text-white shadow-md shadow-brand-700/25">
            <Briefcase size={22} />
          </span>
          <div>
            <h1 className="font-display text-lg font-bold text-slate-900 sm:text-xl">Job Description</h1>
            <p className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
              <Calendar size={12} />
              Posted on{" "}
              {new Date(JobDataById.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div
          className="jd-content p-5 sm:p-7"
          dangerouslySetInnerHTML={{ __html: JobDataById.JD }}
        />
      </article>
    </div>
  );
};

export default JobDetailPageByRecruiter;
