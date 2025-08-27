"use client";

import { useState } from "react";
import Card from "../Card/Card";
import AddJobPost from "../Modal/AddJobPost";
import RecruiterHeader from "../RecruiterHeader/RecruiterHeader";
import JobPost from "../Modal/JobPost";

const RecruiterDashboardComp = (props) => {
  const { fetchJobPostData } = props;
  const [showJobModal, setShowJobModal] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] px-2 sm:px-4 py-4 sm:py-6 flex flex-col relative">
      <RecruiterHeader
        showJobModal={showJobModal}
        setShowJobModal={setShowJobModal}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-6 sm:mt-8">
        {fetchJobPostData?.map((job) => (
          <Card key={job._id} job={job} />
        ))}
      </div>

      {showJobModal && (
        // <AddJobPost
        //   showJobModal={showJobModal}
        //   setShowJobModal={setShowJobModal}
        // />

        <JobPost
          showJobModal={showJobModal}
          setShowJobModal={setShowJobModal}
        />
      )}
    </div>
  );
};

export default RecruiterDashboardComp;
