"use client";

import React from "react";
import { ArrowLeft, Bookmark, Briefcase, Calendar, ChevronRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveForLater } from "@/actions/addPositionActions";
import toast from "react-hot-toast";

const JobDetailPageByCandidate = ({
  JobDataCandidateById,
  fetchAllJobPostData,
}) => {
  const router = useRouter();

  if (!JobDataCandidateById) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
          Loading...
        </div>
      </div>
    );
  }

  const fetchAllJobPostDataFiltered = fetchAllJobPostData?.filter(
    (job) => job?._id !== JobDataCandidateById?._id
  );

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  const handleApply = (jobHtml) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = jobHtml.match(emailRegex);
    if (emails && emails.length > 0) {
      router.push(`/position?emailId=${encodeURIComponent(emails[0])}`);
    } else {
      toast.error("No email found in job description");
    }
  };

  const handleSaveForLater = async (e, jobId) => {
    e.stopPropagation();
    try {
      const result = await saveForLater("savedjobs", { jobId });
      if (result?.statusCode === 201) {
        toast.success(result?.message || "Job saved successfully");
      } else {
        toast.error(result?.message || "Failed to save job");
      }
    } catch (error) {
      toast.error("Failed to save job");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button
        className="mb-5 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-700"
        onClick={() => router.push("/position")}
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </button>

      <article className="rl-card mb-10 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-brand-100 bg-linear-to-r from-brand-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-800 to-brand-500 text-white shadow-md shadow-brand-700/25">
              <Briefcase size={22} />
            </span>
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900 sm:text-xl">Job Description</h1>
              <p className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-xs text-slate-500">
                <Calendar size={12} />
                Posted on{" "}
                {new Date(JobDataCandidateById.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleApply(JobDataCandidateById?.JD)}
            className="rl-btn-primary hidden sm:inline-flex"
          >
            <Send size={15} />
            Apply Now
          </button>
        </div>

        <div
          className="jd-content p-5 sm:p-7"
          dangerouslySetInnerHTML={{ __html: JobDataCandidateById.JD }}
        />

        <div className="border-t border-brand-100 bg-brand-50/40 p-5 sm:flex sm:justify-center sm:p-6">
          <button
            onClick={() => handleApply(JobDataCandidateById?.JD)}
            className="rl-btn-primary w-full px-8 py-3 sm:w-auto"
          >
            <Send size={15} />
            Apply Now
          </button>
        </div>
      </article>

      {fetchAllJobPostDataFiltered?.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Recommended Jobs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {fetchAllJobPostDataFiltered.map((item) => {
              const preview = stripHtml(item.JD).slice(0, 160);
              return (
                <article
                  key={item._id}
                  className="rl-card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </div>

                  <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {preview}...
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleSaveForLater(e, item?._id)}
                      className="rl-btn-secondary flex-1 px-3 py-2"
                    >
                      <Bookmark size={14} />
                      Save
                    </button>
                    <button
                      onClick={() => router.push(`/position/${item._id}`)}
                      className="rl-btn-primary flex-1 px-3 py-2"
                    >
                      Read More
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default JobDetailPageByCandidate;
