import { fetchAppliedData } from "@/actions/addPositionActions";
import { fetchTemplates } from "@/actions/templateListingActons";
import DashboardAnalyticsComp from "@/components/DashboardAnalyticsComp/DashboardAnalyticsComp";
import React from "react";

const DashboardAnalytics = async () => {
  const fetchSavedData = await fetchAppliedData("savedjobs/getSavedJobs");
  const fetchAppliedDatas = await fetchAppliedData(
    "apply/get-position-applied"
  );
  const templateData = await fetchTemplates("position/getUserPositions");

  return (
    <div>
      <DashboardAnalyticsComp
        fetchSavedData={fetchSavedData?.savedJobs}
        fetchAppliedDatas={fetchAppliedDatas?.data}
        templateData={templateData?.data}
      />
    </div>
  );
};

export default DashboardAnalytics;
