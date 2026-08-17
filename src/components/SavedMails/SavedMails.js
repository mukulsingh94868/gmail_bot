"use client";

import { deleteSavedJobs } from "@/actions/addPositionActions";
import { Bookmark, Trash2, ChevronRight, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CandidateHeader from "../CandidateHeader/CandidateHeader";

const SavedMails = ({ fetchSavedData }) => {
  const router = useRouter();
  const [savedMailData, setSavedMailData] = useState(fetchSavedData || []);
  const [headerShowModal, setHeaderShowModal] = useState(false);

  useEffect(() => {
    setSavedMailData(fetchSavedData);
  }, [fetchSavedData]);

  const extractLocation = (jd) => {
    if (!jd) return "Not Available";
    const match = jd.match(/Location:\s*(.*?)</i);
    return match ? match[1].trim() : "Not Available";
  };

  const handleDeleteJobs = async (jobId) => {
    try {
      const result = await deleteSavedJobs(`savedjobs/${jobId}`);
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Job removed from saved list");
        setSavedMailData((prev) => prev.filter((item) => item.jobId !== jobId));
      } else {
        toast.error(result?.message || "Failed to remove job");
      }
    } catch (error) {
      toast.error("Failed to remove job");
    }
  };

  const stripHtml = (html) => {
    if (!html) return "Job Title";
    return html.replace(/<[^>]+>/g, "").trim().split("\n")[0] || "Job Title";
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CandidateHeader showModal={headerShowModal} setShowModal={setHeaderShowModal} />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Saved Jobs
          </h2>

          {savedMailData?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedMailData.map((item) => (
                <div
                  key={item?._id}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={12} />
                      {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </div>
                    <button
                      onClick={() => handleDeleteJobs(item?.jobId)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900">
                    {stripHtml(item?.JD)}
                  </h3>

                  <p className="mb-4 text-xs text-slate-500">
                    {extractLocation(item?.JD)}
                  </p>

                  <button
                    onClick={() => router.push(`/position/${item?.jobId}`)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    View Details
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No saved jobs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedMails;
