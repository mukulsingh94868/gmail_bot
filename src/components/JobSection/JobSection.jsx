"use client";

import { fetchAppliedData } from "@/actions/addPositionActions";
import React, { useState, useEffect } from "react";

const JobSection = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async (page = 1, pageLimit = limit) => {
    setLoading(true);
    try {
      const data = await fetchAppliedData(
        `jobpost/getAllJobsPost?page=${page}&limit=${pageLimit}`
      );
      setJobs(data?.data || []);
      setTotalPages(data?.totalPages || 1);
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
        {" "}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <p className="text-slate-500">Loading...</p>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs?.map((job) => (
            <div
              key={job._id}
              className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition"
            >
              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {job.title}
              </h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                {job.description}
              </p>

              {/* Details */}
              <ul className="text-sm text-slate-700 space-y-1 mb-4">
                <li>
                  <strong>Location:</strong> {job.location}
                </li>
                <li>
                  <strong>Work Mode:</strong> {job.workMode}
                </li>
                <li>
                  <strong>Type:</strong> {job.employmentType}
                </li>
                <li>
                  <strong>Experience:</strong> {job.yearsOfExperience}
                </li>
              </ul>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Spacer pushes buttons to bottom */}
              <div className="flex-grow"></div>

              {/* Buttons always pinned bottom */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition">
                  Save for Later
                </button>
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
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
      )}
    </div>
  );
};

export default JobSection;
