"use client";

import RecruiterHeader from "@/components/RecruiterHeader/RecruiterHeader";
import React, { useState } from "react";

const JobDetailPage = () => {
  const [showJobModal, setShowJobModal] = useState(false);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] px-2 py-0 flex flex-col">
      <RecruiterHeader
        showJobModal={showJobModal}
        setShowJobModal={setShowJobModal}
      />
    </div>
  );
};

export default JobDetailPage;
