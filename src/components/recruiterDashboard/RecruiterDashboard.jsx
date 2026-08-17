"use client";

import { useState } from "react";
import Card from "../Card/Card";
import RecruiterHeader from "../RecruiterHeader/RecruiterHeader";
import JobPost from "../Modal/JobPost";
import { Briefcase, Plus } from "lucide-react";

const RecruiterDashboardComp = (props) => {
  const { fetchJobPostData } = props;
  const [showJobModal, setShowJobModal] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <RecruiterHeader showJobModal={showJobModal} setShowJobModal={setShowJobModal} />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {fetchJobPostData?.length ? (
            <>
              <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Your Job Posts
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {fetchJobPostData.map((job) => (
                  <Card key={job._id} job={job} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <Briefcase className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">No Job Posts Yet</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first job post to start receiving applications from candidates.
                </p>
                <button
                  onClick={() => setShowJobModal(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Plus size={16} />
                  Create Job Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showJobModal && (
        <JobPost showJobModal={showJobModal} setShowJobModal={setShowJobModal} />
      )}
    </div>
  );
};

export default RecruiterDashboardComp;
