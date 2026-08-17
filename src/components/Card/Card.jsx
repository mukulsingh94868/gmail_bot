"use client";

import { Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Card = ({ job }) => {
  const router = useRouter();

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  const previewText = stripHtml(job.JD).slice(0, 200);

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Calendar size={12} />
        {new Date(job.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit", month: "short", year: "numeric",
        })}
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
        {previewText}...
      </p>

      <button
        onClick={() => router.push(`/recruiter-dashboard/${job._id}`)}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        View Details
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default Card;
