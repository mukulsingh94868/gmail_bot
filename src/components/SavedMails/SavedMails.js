"use client";

import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SavedMails = ({ fetchSavedData }) => {
  const router = useRouter();
  const [savedMailData, setSavedMailData] = useState(fetchSavedData || []);

  console.log("fetchSavedData", fetchSavedData);

  useEffect(() => {
    setSavedMailData(fetchSavedData);
  }, [fetchSavedData]);

  const extractLocation = (jd) => {
    const match = jd.match(/📍 Location: (.*?)<\/p>/);
    return match ? match[1] : "Not Available";
  };

  const extractEmail = (jd) => {
    const match = jd.match(/mailto:(.*?)["|']/);
    return match ? match[1] : "email@example.com";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-10">
        <button
          className="flex items-center mb-4 bg-gray-200  px-2 py-0 max-h-fit rounded h-8  justify-center gap-x-1 cursor-pointer"
          onClick={() => router.back()}
        >
          <span className="text-[25px] mb-1">←</span>
          <span className="text-[15px]">Back</span>
        </button>
      </div>
      <h1 className="text-3xl font-semibold text-center mb-8">Saved Mails</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {savedMailData?.length > 0 ? (
          savedMailData?.map((item) => (
            <div
              key={item?._id}
              className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-700">
                  {item?.JD
                    ? item?.JD?.split("<p>")[0]?.replace(/<\/?[^>]+(>|$)/g, "")
                    : "Job Title"}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Location:</strong> {extractLocation(item?.JD)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Posted on:</strong>{" "}
                  {new Date(item?.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-4">
                  <button
                    className="cursor-pointer p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full text-center font-medium transition"
                    onClick={() => router.push(`/position/${item?.jobId}`)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No saved mails available.</p>
        )}
      </div>
    </div>
  );
};

export default SavedMails;
