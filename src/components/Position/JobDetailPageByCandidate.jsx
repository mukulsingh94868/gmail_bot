"use client";

import React from "react";
import { ArrowLeft, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveForLater } from "@/actions/addPositionActions";
import toast from "react-hot-toast";
import CandidateHeader from "../CandidateHeader/CandidateHeader";

const JobDetailPageByCandidate = ({
  JobDataCandidateById,
  fetchAllJobPostData,
}) => {
  const router = useRouter();

  if (!JobDataCandidateById) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CandidateHeader />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            onClick={() => router.push("/position")}
          >
            <ArrowLeft size={16} />
            Back to Jobs
          </button>

          <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Calendar size={12} />
              Posted on{" "}
              {new Date(JobDataCandidateById.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>

            <div
              className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700"
              dangerouslySetInnerHTML={{ __html: JobDataCandidateById.JD }}
            />

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => handleApply(JobDataCandidateById?.JD)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Apply Now
              </button>
            </div>
          </div>

          {fetchAllJobPostDataFiltered?.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
                Recommended Jobs
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {fetchAllJobPostDataFiltered.map((item) => {
                  const preview = stripHtml(item.JD).slice(0, 160);
                  return (
                    <div
                      key={item._id}
                      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-2 text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </div>

                      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {preview}...
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleSaveForLater(e, item?._id)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => router.push(`/position/${item._id}`)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Read More
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPageByCandidate;
