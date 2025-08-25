"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, Laptop, User, Calendar, Clock } from "lucide-react";
import RecruiterHeader from "../RecruiterHeader/RecruiterHeader";
import Card from "../Card/Card";

const JobDetailPageByRecruiter = ({ JobDataById, fetchJobPostData }) => {
  const [showJobModal, setShowJobModal] = useState(false);

  const otherData = fetchJobPostData?.filter(
    (item) => item._id !== JobDataById?._id
  );

  if (!JobDataById) return <p>Loading...</p>;
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] px-4 py-6 flex flex-col">
      <RecruiterHeader
        showJobModal={showJobModal}
        setShowJobModal={setShowJobModal}
      />

      <div className="flex-1 w-full mt-6">
        {/* <div className="bg-white rounded-2xl shadow-lg p-8 w-full h-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {JobDataById?.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Posted by{" "}
                <span className="font-semibold">
                  {JobDataById?.recruiterId?.name}
                </span>
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                JobDataById?.status === "Open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {JobDataById?.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              {JobDataById?.employmentType}
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              {JobDataById?.location}
            </div>
            <div className="flex items-center text-gray-700">
              <Laptop className="w-5 h-5 mr-2 text-blue-600" />
              {JobDataById?.workMode}
            </div>
            <div className="flex items-center text-gray-700">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              {JobDataById?.experienceLevel} – {JobDataById?.yearsOfExperience}{" "}
              yrs
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Posted on {new Date(JobDataById?.createdAt).toDateString()}
            </div>
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Updated {new Date(JobDataById?.updatedAt).toDateString()}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {JobDataById?.description}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {JobDataById?.skillsRequired?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              onClick={() => alert("Saved for later!")}
            >
              Save Job
            </button>
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => alert("Applied successfully!")}
            >
              {JobDataById?.isApplied ? "Applied" : "Apply Now"}
            </button>
          </div>
        </div> */}

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Job Details
          </h1>
          <div
            className="prose max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: JobDataById?.JD }}
          />
        </div>

        {/* <div className="mx-auto w-full grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-6 sm:mt-8">
          {otherData?.map((job) => (
            <Card key={job._id} job={job} />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default JobDetailPageByRecruiter;
