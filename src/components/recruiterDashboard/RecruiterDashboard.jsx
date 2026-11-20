"use client";

import { useState } from "react";
import Card from "../Card/Card";
import JobPost from "../Modal/JobPost";
import { Briefcase, Plus } from "lucide-react";
import PageHeader from "../ui/PageHeader";
import EmptyState from "../ui/EmptyState";

const RecruiterDashboardComp = (props) => {
  const { fetchJobPostData } = props;
  const [showJobModal, setShowJobModal] = useState(false);

  return (
    <div className="mx-auto max-w-7xl">
      {fetchJobPostData?.length ? (
        <>
          <PageHeader
            title="Your Job Posts"
            description="Job descriptions you've published for candidates to discover and apply to."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fetchJobPostData.map((job) => (
              <Card key={job._id} job={job} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center">
          <EmptyState
            className="w-full max-w-md"
            icon={Briefcase}
            title="No Job Posts Yet"
            description="Create your first job post to start receiving applications from candidates."
            action={
              <button onClick={() => setShowJobModal(true)} className="rl-btn-primary">
                <Plus size={16} />
                Create Job Post
              </button>
            }
          />
        </div>
      )}

      {showJobModal && (
        <JobPost showJobModal={showJobModal} setShowJobModal={setShowJobModal} />
      )}
    </div>
  );
};

export default RecruiterDashboardComp;
