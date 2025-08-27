import { getJobPostByRecruiterId } from "@/actions/addJobPostActions";
import { fetchJobOptions } from "@/actions/addPositionActions";
import JobDetailPageByCandidate from "@/components/Position/JobDetailPageByCandidate";
import React from "react";

const DetailJObSection = async ({ searchParams, params }) => {
  const JobDataById = await getJobPostByRecruiterId(`jd/getJd/${params?.id}`);
  const fetchAllJobPostData = await fetchJobOptions("jd/getAllJds");
  return (
    <div>
      <JobDetailPageByCandidate
        JobDataCandidateById={JobDataById?.jobPost}
        fetchAllJobPostData={fetchAllJobPostData?.jobPosts}
      />
    </div>
  );
};

export default DetailJObSection;
