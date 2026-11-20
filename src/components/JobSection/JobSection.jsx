"use client";

import { fetchAppliedData, saveForLater } from "@/actions/addPositionActions";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Bookmark, Briefcase, Calendar, ChevronRight, ChevronsUpDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import EmptyState from "../ui/EmptyState";

const JobSection = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (page = 1, pageLimit = limit) => {
    setLoading(true);
    try {
      const data = await fetchAppliedData(
        `jd/getAllJds?page=${page}&limit=${pageLimit}`
      );
      setJobs(data?.jobPosts || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
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

  const getVisiblePages = (total, current) => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift("...");
    if (current + delta < total - 1) range.push("...");
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

  useEffect(() => {
    fetchJobs(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <section aria-labelledby="available-jobs-title">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="available-jobs-title"
            className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            Available Jobs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fresh openings posted by recruiters. Save them for later or apply in one click.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-slate-500">
            Show
          </label>
          <div className="relative">
            <select
              id="limit"
              value={limit}
              onChange={handleLimitChange}
              className="rl-input cursor-pointer appearance-none bg-white py-1.5 pl-3 pr-8"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronsUpDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-canvas/80 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />
              Loading jobs...
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {jobs?.map((job) => {
            const preview = stripHtml(job.JD).slice(0, 180);
            return (
              <article
                key={job._id}
                className="rl-card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100">
                    <Briefcase size={18} />
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                      <Calendar size={12} />
                      {new Date(job.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {job?.isSaved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                        <Bookmark size={10} className="fill-current" />
                        Saved
                      </span>
                    )}
                  </div>
                </div>

                <p className="mb-5 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600">
                  {preview}...
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleSaveForLater(e, job?._id)}
                    className="rl-btn-secondary flex-1 px-3 py-2"
                  >
                    <Bookmark size={14} />
                    Save
                  </button>
                  <button
                    onClick={() => router.push(`/position/${job._id}`)}
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

        {!loading && jobs?.length === 0 && (
          <EmptyState
            icon={Briefcase}
            title="No jobs available"
            description="New openings will appear here as soon as recruiters post them."
          />
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`cursor-pointer rounded-lg ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {getVisiblePages(totalPages, currentPage).map((page, idx) => (
                <PaginationItem key={`${page}-${idx}`}>
                  <PaginationLink
                    onClick={() => typeof page === "number" && handlePageChange(page)}
                    isActive={currentPage === page}
                    className={`cursor-pointer rounded-lg ${
                      currentPage === page
                        ? "border-transparent bg-linear-to-r from-brand-900 to-brand-700 text-white hover:text-white"
                        : ""
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`cursor-pointer rounded-lg ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </section>
  );
};

export default JobSection;
