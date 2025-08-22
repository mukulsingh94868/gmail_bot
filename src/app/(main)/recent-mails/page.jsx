import { fetchAppliedData } from "@/actions/addPositionActions";
import RecentMail from "@/components/RecentMail/RecentMail";
import React from "react";

const RecentMails = async () => {
  const fetchAppliedDatas = await fetchAppliedData(
    "apply/get-position-applied"
  );

  return (
    <div>
      <RecentMail fetchAppliedDatas={fetchAppliedDatas?.data} />
    </div>
  );
};

export default RecentMails;
