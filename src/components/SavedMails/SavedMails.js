"use client";

import { deleteSavedJobs } from "@/actions/addPositionActions";
import { Bookmark, Calendar, ChevronRight, MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import EmptyState from "../ui/EmptyState";

const SavedMails = ({ fetchSavedData }) => {
  const router = useRouter();
  const [savedMailData, setSavedMailData] = useState(fetchSavedData || []);

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
    return (
      html
        .replace(/<[^>]+>/g, "")
        .trim()
        .split("\n")[0] || "Job Title"
    );
  };

  return (
    <div className="mx-auto">
      <PageHeader
        title="Saved Jobs"
        description="Openings you bookmarked to revisit and apply to later."
      />

      {savedMailData?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedMailData.map((item) => (
            <article
              key={item?._id}
              className="rl-card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <Bookmark size={18} className="fill-current" />
                </span>
                <button
                  onClick={() => handleDeleteJobs(item?.jobId)}
                  className="rl-icon-btn hover:bg-rose-50 hover:text-rose-600"
                  title="Remove"
                  aria-label="Remove saved job"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <h3 className="mb-3 line-clamp-2 font-display text-sm font-semibold text-slate-900">
                {stripHtml(item?.JD)}
              </h3>

              <div className="mb-5 flex flex-1 flex-col gap-1.5 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  {extractLocation(item?.JD)}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Calendar size={13} className="text-slate-400" />
                  {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <button
                onClick={() => router.push(`/position/${item?.jobId}`)}
                className="rl-btn-primary w-full px-3 py-2"
              >
                View Details
                <ChevronRight size={14} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Tap Save on any job in Available Jobs to keep it here."
        />
      )}
    </div>
  );
};

export default SavedMails;
