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
        {fetchJobPostData?.length ? (
          fetchJobPostData?.map((job) => <Card key={job._id} job={job} />)
        ) : (
          <div className="w-full flex justify-center items-center min-h-[50vh]">
            <div className="w-full max-w-md bg-white border border-slate-200 shadow-lg rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">No Templates Found</h2>
              <p className="text-slate-600 mb-6 text-base sm:text-lg">
                You haven’t created any templates yet.<br className="hidden sm:block" />
                Please create a template to apply for a position.
              </p>
              <button
                onClick={() => setShowJobModal(true)}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md cursor-pointer transition-all"
              >
                Create Job Post
              </button>
            </div>
          </div>
        )}
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
