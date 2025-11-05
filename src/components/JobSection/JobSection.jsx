"use client";

import { fetchAppliedData, saveForLater } from "@/actions/addPositionActions";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    const payload = { jobId };
    try {
      const result = await saveForLater("savedjobs", payload);
      if (result?.statusCode === 201) {
        toast.success(result?.message || "Job saved successfully");
      } else {
        toast.error(result?.message || "Failed to save job");
      }
    } catch (error) {
      toast.error("Failed to save job: " + (error?.message || error));
    }
  };

  useEffect(() => {
    fetchJobs(currentPage, limit);
  }, [currentPage, limit]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Jobs</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="limit" className="text-sm font-medium text-gray-700">
            Rows per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleLimitChange}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm 
               shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 
               transition ease-in-out duration-150 cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <p className="text-slate-500">Loading...</p>
          </div>
        )}

        {/* Job Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs?.map((job) => {
            const preview = stripHtml(job.JD).slice(0, 200);
            return (
              <div
                key={job._id}
                className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition"
              >
                {/* Job JD preview */}
                <div className="text-slate-700 text-sm mb-3 line-clamp-4">
                  {preview}...
                </div>

                {/* Recruiter & Meta */}
                <ul className="text-sm text-slate-700 space-y-1 mb-4">
                  {/* <li>
                    <strong>Recruiter ID:</strong> {job.recruiterId}
                  </li> */}
                  <li>
                    <strong>Posted On:</strong>{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </li>
                  {/* <li>
                    <strong>Job ID:</strong> {job._id}
                  </li> */}
                </ul>

                <div className="flex-grow"></div>

                <div className="flex gap-3 mt-4">
                  <button
                    className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                    onClick={(e) => handleSaveForLater(e, job?._id)}
                  >
                    Save for Later
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                    onClick={() => router.push(`/position/${job._id}`)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSection;
