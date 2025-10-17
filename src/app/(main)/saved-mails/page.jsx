import { fetchAppliedData } from "@/actions/addPositionActions";
import SavedMails from "@/components/SavedMails/SavedMails";
import React from "react";

const page = async () => {
  const fetchSavedData = await fetchAppliedData(
    "savedjobs/getSavedJobs"
  );
  return (
    <div>
      <SavedMails fetchSavedData={fetchSavedData?.savedJobs} />
    </div>
  );
};

export default page;