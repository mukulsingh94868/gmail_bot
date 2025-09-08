import { fetchJobOptions } from "@/actions/addPositionActions";
import RecruiterDashboardComp from "@/components/recruiterDashboard/RecruiterDashboard";

const RecruiterDashboard = async () => {
  const fetchJobPostData = await fetchJobOptions('jd/getRecruiterJds');
  // const fetchJobPostData = await fetchJobOptions('jobpost/getJobsPostByRecruiter');
  return (
    <RecruiterDashboardComp fetchJobPostData={fetchJobPostData?.jobPosts} />
  );
};

export default RecruiterDashboard;