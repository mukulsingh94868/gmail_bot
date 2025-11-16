"use client";

import { useRouter } from "next/navigation";
import React from "react";

const FaqComponent = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-white shadow-sm px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition mb-6 w-fit"
      >
        <span className="text-lg">←</span>
        <span className="font-medium">Back</span>
      </button>

      {/* FAQ CONTAINER */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <span>❓</span> FAQ / Help
        </h2>

        <div className="space-y-6">
          {/* FAQ ITEM */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              How do I apply for a position using RecruitLoop?
            </h3>
            <ul className="list-disc ml-5 text-gray-600 space-y-1">
              <li>Select your desired job position from the dropdown menu.</li>
              <li>Enter the HR's email address in the provided field.</li>
              <li>
                Click “Send Email” to open Gmail with a pre-filled application
                template.
              </li>
              <li>You can also download your resume if required.</li>
            </ul>
          </div>

          {/* FAQ ITEM */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              What does Recent Activity show?
            </h3>
            <p className="text-gray-600">
              Displays your most recent applications sent through RecruitLoop.
            </p>
          </div>

          {/* FAQ ITEM */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              How is my data handled?
            </h3>
            <p className="text-gray-600">
              Your application history is securely stored and never shared with
              third parties.
            </p>
          </div>

          {/* FAQ ITEM */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Where can I get further assistance?
            </h3>
            <p className="text-gray-600">
              For support, please contact the RecruitLoop development team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqComponent;
