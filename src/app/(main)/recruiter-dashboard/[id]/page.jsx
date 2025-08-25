import { getJobPostByRecruiterId } from "@/actions/addJobPostActions";
import { fetchJobOptions } from "@/actions/addPositionActions";
import JobDetailPageByRecruiter from "@/components/recruiterDashboard/JobDetailPageByRecruiter";

const JobDetailPage = async ({ searchParams, params }) => {
  const JobDataById = await getJobPostByRecruiterId(
    `jd/getJd/${params?.id}`
  );
  // const JobDataById = await getJobPostByRecruiterId(
  //   `jobpost/getJobPostById/${params.id}`
  // );
  const fetchJobPostData = await fetchJobOptions(
    "jobpost/getJobsPostByRecruiter"
  );
  return (
    <JobDetailPageByRecruiter
      JobDataById={JobDataById?.jobPost}
      fetchJobPostData={fetchJobPostData?.data}
    />
  );
};

export default JobDetailPage;
