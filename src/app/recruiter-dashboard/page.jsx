import { fetchOptions } from "@/actions/addPositionActions";
import RecruiterDashboardComp from "@/components/recruiterDashboard/RecruiterDashboard";

const RecruiterDashboard = async () => {
  const fetchJobPostData = await fetchOptions('jobpost/getJobsPostByRecruiter');
  return (
    <RecruiterDashboardComp fetchJobPostData={fetchJobPostData?.data} />
  );
};

export default RecruiterDashboard;
