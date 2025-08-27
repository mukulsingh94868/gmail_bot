import { Calendar, User, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Card = ({ job }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // Function to strip HTML tags (for preview text)
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, ""); // remove tags
  };

  // Show preview only (first 200 chars) if not expanded
  const previewText = stripHtml(job.JD).slice(0, 200);

  return (
    <div
      key={job._id}
      className="bg-white rounded-3xl shadow-lg border border-slate-100 p-7 flex flex-col justify-between hover:shadow-2xl transition-all duration-200 group"
    >
      {/* JD Preview */}
      <div className="text-slate-700 prose prose-sm max-w-none">
        {!expanded ? (
          <>
            <p>{previewText}...</p>
            <button
              onClick={() => router.push(`/recruiter-dashboard/${job._id}`)}
              className="text-blue-600 font-medium hover:underline mt-2"
            >
              Read More →
            </button>
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: job.JD }} />
        )}
      </div>

      {/* Meta Info */}
      <div className="mt-5 space-y-3 text-[14px] text-slate-700">
        <p className="flex items-center gap-2">
          <User size={16} className="text-blue-600" />
          <span className="font-medium">Recruiter ID: {job.recruiterId}</span>
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-emerald-600" />
          <span className="font-medium">
            Posted on:{" "}
            {new Date(job.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <FileText size={16} className="text-indigo-600" />
          <span className="font-medium">Job ID: {job._id}</span>
        </p>
      </div>
    </div>
  );
};

export default Card;
