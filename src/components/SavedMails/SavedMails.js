"use client";

import { FileText, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SavedMails = ({ fetchSavedData }) => {
  const router = useRouter();
  const [savedMailData, setSavedMailData] = useState(fetchSavedData || []);

  console.log("fetchSavedData", fetchSavedData);

  useEffect(() => {
    setSavedMailData(fetchSavedData);
  }, [fetchSavedData]);
  return (
    <div className="w-full flex justify-center px-2 sm:px-6 md:px-12 lg:px-0">
      {savedMailData?.length > 0 && (
        <div className="w-full max-w-4xl mt-10">
          <div className="mb-10">
            <button
              className="flex items-center mb-4 bg-gray-200  px-2 py-0 max-h-fit rounded h-8  justify-center gap-x-1 cursor-pointer"
              onClick={() => router.back()}
            >
              <span className="text-[25px] mb-1">←</span>
              <span className="text-[15px]">Back</span>
            </button>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2 border-b border-slate-200 pb-4">
            <span className="text-3xl">📜</span> Recent Activity
          </h3>
          <div className="overflow-x-auto rounded-2xl shadow-md bg-white">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedMailData?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-4 text-base text-slate-800 font-medium flex items-center gap-2 whitespace-nowrap">
                      <Mail className="text-blue-600" size={18} />
                      <span className="break-all">{item.emailApplied}</span>
                    </td>
                    <td className="px-4 py-4 text-base text-blue-700 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FileText className="text-indigo-600" size={16} />
                        <span className="bg-blue-100 px-2 py-1 rounded-md text-sm">
                          {item?.positionApplied}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                      {new Date(item?.dateAndTime).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedMails;
