"use client";

import { Send } from "lucide-react";
import EmptyState from "../ui/EmptyState";

const AppliedMails = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
      <EmptyState
        className="w-full"
        icon={Send}
        title="Coming Soon"
        description="This feature is under development."
      />
    </div>
  );
};

export default AppliedMails;
