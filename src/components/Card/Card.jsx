"use client";

import { Briefcase, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Card = ({ job }) => {
  const router = useRouter();

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  const previewText = stripHtml(job.JD).slice(0, 200);

  return (
    <article className="rl-card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-100">
          <Briefcase size={18} />
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
          <Calendar size={12} />
          {new Date(job.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })}
        </span>
      </div>

      <p className="mb-5 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600">
        {previewText}...
      </p>

      <button
        onClick={() => router.push(`/recruiter-dashboard/${job._id}`)}
        className="rl-btn-primary w-full px-3 py-2"
      >
        View Details
        <ChevronRight size={14} />
      </button>
    </article>
  );
};

export default Card;
