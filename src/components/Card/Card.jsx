import { Briefcase, CheckCircle, Users } from "lucide-react";
import React from "react";

const Card = ({ job }) => {
  return (
    <div
      key={job._id}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition"
    >
      {/* Title & Location */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{job.title}</h2>
        <p className="text-sm text-slate-500">
          {job.location} ({job.workMode})
        </p>
        <p className="text-xs text-slate-400">
          {new Date(job.createdAt).toLocaleDateString()} •{" "}
          {job.status === "Open" ? "Hiring Now" : "Closed"}
        </p>
      </div>

      {/* Meta Info */}
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Briefcase size={16} className="text-blue-600" />
          {job.employmentType}
        </p>
        <p className="flex items-center gap-2">
          <Users size={16} className="text-emerald-600" />
          Exp: {job.yearsOfExperience} • {job.experienceLevel}
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle size={16} className="text-indigo-600" />
          Skills: {job.skillsRequired.join(", ")}
        </p>
      </div>

      {/* <div className="mt-5 flex gap-2">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                                Easy Apply
                            </button>
                            <button className="flex-1 border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium text-slate-700">
                                Save
                            </button>
                        </div> */}
    </div>
  );
};

export default Card;
