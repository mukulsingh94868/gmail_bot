"use client";

import React from "react";
import { ArrowLeft, Calendar, User, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { saveForLater } from "@/actions/addPositionActions";
import toast from "react-hot-toast";

const JobDetailPageByCandidate = ({
  JobDataCandidateById,
  fetchAllJobPostData,
}) => {
  const router = useRouter();

  if (!JobDataCandidateById) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No job details found.
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

    console.log("Extracted emails:", emails);
    if (emails && emails.length > 0) {
      const email = emails[0]; // take first email found
      router.push(`/position?emailId=${encodeURIComponent(email)}`);
    } else {
      alert("No email found in job description");
    }
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/position"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} /> Back to Jobs
        </Link>
      </div>

      {/* Job Detail Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Details</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-500 text-sm mb-6">
          {/* <p className="flex items-center gap-2">
            <User size={16} /> Recruiter ID:{" "}
            <span className="font-medium text-gray-700">
              {JobDataCandidateById.recruiterId}
            </span>
          </p> */}
          <p className="flex items-center gap-2 mt-2 sm:mt-0">
            <Calendar size={16} /> Posted On:{" "}
            <span className="font-medium text-gray-700">
              {new Date(JobDataCandidateById.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>

        <hr className="mb-6" />

        {/* JD */}
        <div
          className="prose prose-blue max-w-none text-gray-800 leading-7"
          dangerouslySetInnerHTML={{ __html: JobDataCandidateById.JD }}
        />

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => handleApply(JobDataCandidateById?.JD)}
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Recommended Jobs
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {fetchAllJobPostDataFiltered?.map((item) => {
            const preview = stripHtml(item.JD).slice(0, 160);
            return (
              <div
                key={item._id}
                className="flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition"
              >
                {/* Job Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                  {preview.split(" ").slice(0, 8).join(" ")}...
                </h3>

                {/* Preview */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {preview}...
                </p>

                {/* Meta Info */}
                <ul className="text-xs text-gray-500 space-y-1 mb-4">
                  <li>
                    <User size={14} className="inline mr-1" /> Recruiter:{" "}
                    <span className="text-gray-700">{item.recruiterId}</span>
                  </li>
                  <li>
                    <Calendar size={14} className="inline mr-1" /> Posted On:{" "}
                    <span className="text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                  <li>
                    <Briefcase size={14} className="inline mr-1" /> Job ID:{" "}
                    <span className="text-gray-700">{item._id}</span>
                  </li>
                </ul>

                {/* Actions */}
                <div className="flex gap-3 mt-auto">
                  <button
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
                    onClick={(e) => handleSaveForLater(e, item?._id)}
                  >
                    Save for Later
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
                    onClick={() => router.push(`/position/${item._id}`)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPageByCandidate;
