import { handleJobPost } from "@/actions/addJobPostActions";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddJobPost = ({ setShowJobModal }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employmentType: "",
    location: "",
    workMode: "",
    experienceLevel: "",
    yearsOfExperience: "",
    skillsRequired: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Basic validation
      if (
        !formData.title ||
        !formData.description ||
        !formData.employmentType ||
        !formData.location ||
        !formData.workMode ||
        !formData.experienceLevel ||
        !formData.yearsOfExperience ||
        !formData.skillsRequired
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // ✅ Prepare payload
      const payload = {
        ...formData,
        skillsRequired: formData.skillsRequired
          .split(",")
          .map((skill) => skill.trim()),
      };

      console.log("Payload:", payload);

      // ✅ API call
      const result = await handleJobPost("jobpost/createJobPost", payload);

      if (result?.statusCode === 201) {
        toast.success(result?.message || "Job posted successfully");
        setTimeout(() => {
          setShowJobModal(false);
        }, 1000);
      } else {
        toast.error(result?.message || "Failed to post job");
      }

      console.log("result", result);
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 bg-opacity-90 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-2xl p-6 sm:p-10 border border-blue-300 transition-all duration-300 ease-in-out">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">
          🚀 Add Job Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="employmentType"
              placeholder="Employment Type"
              value={formData.employmentType}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="workMode"
              placeholder="Work Mode (Remote/On-site)"
              value={formData.workMode}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="experienceLevel"
              placeholder="Experience Level"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="yearsOfExperience"
              placeholder="Years of Experience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <input
              type="text"
              name="skillsRequired"
              placeholder="Skills (comma separated)"
              value={formData.skillsRequired}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full sm:col-span-2"
            />
          </div>

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full min-h-[100px]"
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
              onClick={() => setShowJobModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow transition"
            >
              Add Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobPost;
