"use client";

import { useState } from "react";
import Card from "../Card/Card";
import AddJobPost from "../Modal/AddJobPost";
import RecruiterHeader from "../RecruiterHeader/RecruiterHeader";

const RecruiterDashboardComp = (props) => {
  const { fetchJobPostData } = props;
  const [showJobModal, setShowJobModal] = useState(false);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] px-2 py-0 flex flex-col">
      <RecruiterHeader showJobModal={showJobModal} setShowJobModal={setShowJobModal} />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fetchJobPostData?.map((job) => (
          <Card job={job} />
        ))}
      </div>

      {showJobModal && (
        <AddJobPost
          showJobModal={showJobModal}
          setShowJobModal={setShowJobModal}
        />
      )}
    </div>
  );
};

export default RecruiterDashboardComp;
