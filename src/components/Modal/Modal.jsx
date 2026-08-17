"use client";
import { handleGenerateMail, positionApply } from "@/actions/addPositionActions";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Sparkles, X } from "lucide-react";

const AddPositionModal = ({ setShowModal }) => {
  const [positionApplied, setPositionApplied] = useState({
    position: "",
    emailSubject: "",
    emailBody: "",
  });
  const [emailPrompt, setEmailPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAddPosition = async (e) => {
    e.preventDefault();
    if (isGenerating || isRegistering) {
      toast.error("Please wait until generation is complete.");
      return;
    }
    setIsRegistering(true);
    try {
      const result = await positionApply("position/positionApply", positionApplied);
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Position added successfully");
        setTimeout(() => setShowModal(false), 1000);
      } else {
        toast.error(result?.message || "Failed to add position");
      }
    } catch (error) {
      toast.error("Failed to add position: " + (error?.message || error));
    } finally {
      setIsRegistering(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPositionApplied((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!emailPrompt.trim()) {
      toast.error("Please enter a prompt before generating the email.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await handleGenerateMail("position/generateMail", { position: emailPrompt });
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
      toast.error("Error generating email: " + (error?.message || error));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isRegistering && setShowModal(false)}
      />

      {isRegistering && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="mt-3 text-sm font-medium text-slate-700">Creating template...</span>
        </div>
      )}

      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Template</h2>
            <p className="mt-0.5 text-sm text-slate-500">Create an email template for job applications</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAddPosition} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Position Title</label>
            <input
              type="text"
              name="position"
              placeholder="e.g. Frontend Developer"
              value={positionApplied.position}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Prompt
              <span className="ml-1 text-slate-400 font-normal">(optional - use AI to generate)</span>
            </label>
            <div className="flex gap-2">
              <textarea
                placeholder="e.g. Apply for a React developer role at a fintech startup..."
                onChange={(e) => setEmailPrompt(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[80px] resize-none"
                value={emailPrompt}
                disabled={isGenerating}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Subject</label>
            <input
              type="text"
              name="emailSubject"
              placeholder="e.g. Application for Frontend Developer Role"
              value={positionApplied.emailSubject}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Body</label>
            <textarea
              name="emailBody"
              placeholder="Write your email body content..."
              value={positionApplied.emailBody}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              onClick={() => setShowModal(false)}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPositionModal;
