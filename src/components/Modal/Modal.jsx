"use client";
import {
  handleGenerateMail,
  positionApply,
} from "@/actions/addPositionActions";
import { useState } from "react";
import toast from "react-hot-toast";

const AddPositionModal = ({ setShowModal }) => {
  const [positionApplied, setPositionApplied] = useState({
    position: "",
    emailSubject: "",
    emailBody: "",
  });

  const [emailPrompt, setEmailPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddPosition = async (e) => {
    e.preventDefault();
    // Prevent submission while a generation request is in-flight
    if (isGenerating) {
      toast.error("Please wait until generation is complete.");
      return;
    }

    try {
      const result = await positionApply(
        "position/positionApply",
        positionApplied
      );
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Position added successfully");
        setShowModal(false);
      } else {
        toast.error(result?.message || "Failed to add position");
      }
    } catch (error) {
      toast.error("Failed to add position: " + (error?.message || error));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPositionApplied((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!emailPrompt.trim()) {
      toast.error("Please enter a prompt before generating the email.");
      return;
    }

    setIsGenerating(true);
    const payload = { position: emailPrompt };

    try {
      const result = await handleGenerateMail("position/generateMail", payload);
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Email generated successfully");

        setPositionApplied((prev) => ({
          ...prev,
          emailSubject: result?.data?.subject || "",
          emailBody: result?.data?.body || "",
        }));
      } else {
        toast.error(result?.message || "Failed to generate email content");
      }
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Error generating email: " + (error?.message || error));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 bg-opacity-90 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-10 border border-blue-300 transition-all duration-300 ease-in-out">
        <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 mb-6 text-center drop-shadow">
          🚀 Add New Position
        </h2>

        <form
          onSubmit={handleAddPosition}
          className="flex flex-col gap-4 sm:gap-5"
        >
          <input
            type="text"
            name="position"
            placeholder="Position Title (e.g., Frontend Developer)"
            value={positionApplied.position}
            onChange={handleChange}
            className="p-3 sm:p-4 rounded-lg border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400"
            required
          />

          {/* Prompt + Generate (prompt is NOT required for the form submit) */}
          <div className="flex items-start gap-4">
            <textarea
              name="emailPrompt"
              placeholder="Email Prompt (optional — use Generate to auto-fill subject & body)"
              onChange={(e) => setEmailPrompt(e.target.value)}
              className="flex-1 p-3 sm:p-4 rounded-lg border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400 min-h-[100px] sm:min-h-[120px] resize-none"
              value={emailPrompt}
              // NOTE: no 'required' here — manual filling of subject/body is supported
              disabled={isGenerating}
            />

            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                aria-busy={isGenerating}
                className={`px-4 py-2 rounded-lg font-medium text-white shadow-sm transition ${
                  isGenerating
                    ? "bg-blue-500 cursor-not-allowed opacity-90"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isGenerating ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </div>

          <input
            type="text"
            name="emailSubject"
            placeholder="Email Subject"
            value={positionApplied.emailSubject}
            onChange={handleChange}
            className="p-3 sm:p-4 rounded-lg border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400"
            required
          />

          <textarea
            name="emailBody"
            placeholder="Email Body Content..."
            value={positionApplied.emailBody}
            onChange={handleChange}
            className="p-3 sm:p-4 rounded-lg border border-blue-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 bg-white shadow-sm placeholder:text-gray-400 min-h-[100px] sm:min-h-[120px] resize-none"
            required
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-2">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition"
              onClick={() => setShowModal(false)}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow transition ${
                isGenerating ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={isGenerating}
            >
              Add Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPositionModal;
