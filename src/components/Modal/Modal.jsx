"use client";
import { handleGenerateMail, positionApply } from "@/actions/addPositionActions";
import { useState } from "react";
import toast from "react-hot-toast";
import { FilePlus2, Loader2, Sparkles } from "lucide-react";
import ModalShell from "../ui/ModalShell";

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
    <ModalShell
      title="New Template"
      description="Create an email template for job applications"
      icon={FilePlus2}
      onClose={() => !isRegistering && setShowModal(false)}
      overlay={
        isRegistering && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-brand-700" />
            <span className="mt-3 text-sm font-medium text-slate-700">Creating template...</span>
          </div>
        )
      }
    >
      <form onSubmit={handleAddPosition} className="space-y-4">
        <div>
          <label htmlFor="tpl-position" className="rl-label">Position Title</label>
          <input
            id="tpl-position"
            type="text"
            name="position"
            placeholder="e.g. Frontend Developer"
            value={positionApplied.position}
            onChange={handleChange}
            className="rl-input"
            required
          />
        </div>

        <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-3.5">
          <label htmlFor="tpl-prompt" className="rl-label">
            <Sparkles size={14} className="text-brand-600" />
            Email Prompt
            <span className="font-normal text-slate-400">(optional · use AI to generate)</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              id="tpl-prompt"
              placeholder="e.g. Apply for a React developer role at a fintech startup..."
              onChange={(e) => setEmailPrompt(e.target.value)}
              className="rl-input min-h-[80px] flex-1 resize-none bg-white"
              value={emailPrompt}
              disabled={isGenerating}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="rl-btn-secondary self-stretch sm:self-start"
            >
              {isGenerating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {isGenerating ? "Generating" : "Generate"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="tpl-subject" className="rl-label">Email Subject</label>
          <input
            id="tpl-subject"
            type="text"
            name="emailSubject"
            placeholder="e.g. Application for Frontend Developer Role"
            value={positionApplied.emailSubject}
            onChange={handleChange}
            className="rl-input"
            required
          />
        </div>

        <div>
          <label htmlFor="tpl-body" className="rl-label">Email Body</label>
          <textarea
            id="tpl-body"
            name="emailBody"
            placeholder="Write your email body content..."
            value={positionApplied.emailBody}
            onChange={handleChange}
            className="rl-input min-h-[140px] resize-y"
            required
          />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            className="rl-btn-outline"
            onClick={() => setShowModal(false)}
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button type="submit" disabled={isGenerating} className="rl-btn-primary">
            Add Template
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default AddPositionModal;
