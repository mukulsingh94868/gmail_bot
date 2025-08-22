import { Briefcase, CheckCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Card = ({ job }) => {
  const router = useRouter();
  return (
    <div
      key={job._id}
      onClick={() => router.push(`/recruiter-dashboard/${job?._id}`)}
      className="cursor-pointer bg-white rounded-3xl shadow-lg border border-slate-100 p-7 flex flex-col justify-between hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 group"
      style={{ minHeight: '260px' }}
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition">{job.title}</h2>
        <p className="text-base text-slate-500 font-medium mb-1">
          {job.location} <span className="text-xs text-slate-400">({job.workMode})</span>
        </p>
        <p className="text-xs text-slate-400 mb-2">
          {new Date(job.createdAt).toLocaleDateString()} •{' '}
          <span className={job.status === 'Open' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
            {job.status === 'Open' ? 'Hiring Now' : 'Closed'}
          </span>
        </p>
      </div>

      {/* Meta Info */}
      <div className="mt-4 space-y-3 text-[15px] text-slate-700">
        <p className="flex items-center gap-2">
          <Briefcase size={18} className="text-blue-600" />
          <span className="font-medium">{job.employmentType}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users size={18} className="text-emerald-600" />
          <span className="font-medium">Exp: {job.yearsOfExperience} • {job.experienceLevel}</span>
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle size={18} className="text-indigo-600" />
          <span className="font-medium">Skills: {job.skillsRequired.join(', ')}</span>
        </p>
      </div>

      {/* Action Buttons (optional, uncomment if needed) */}
      {/* <div className="mt-6 flex gap-2">
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
