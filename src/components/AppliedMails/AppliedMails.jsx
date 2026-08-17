"use client";

import { Mail, Send } from "lucide-react";

const AppliedMails = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Send className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Coming Soon</h3>
        <p className="mt-1 text-sm text-slate-500">
          This feature is under development.
        </p>
      </div>
    </div>
  );
};

export default AppliedMails;
