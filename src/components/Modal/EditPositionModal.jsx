"use client";

import { editUserPositions } from "@/actions/addPositionActions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PencilLine } from "lucide-react";
import ModalShell from "../ui/ModalShell";

export const EditPositionModal = ({ setShowModal, editData }) => {
  const [formData, setFormData] = useState({
    position: "",
    emailSubject: "",
    emailBody: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        position: editData.position || "",
        emailSubject: editData.emailSubject || "",
        emailBody: editData.emailBody || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const result = await editUserPositions(`position/editUserPositions/${editData._id}`, formData);
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Position updated");
        setShowModal(false);
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update error: " + error.message);
    }
  };

  return (
    <ModalShell
      title="Edit Template"
      description="Update your email template"
      icon={PencilLine}
      onClose={() => setShowModal(false)}
    >
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="edit-position" className="rl-label">Position</label>
          <input
            id="edit-position"
            type="text"
            name="position"
            placeholder="e.g. React Developer"
            value={formData.position}
            onChange={handleChange}
            required
            className="rl-input"
          />
        </div>

        <div>
          <label htmlFor="edit-subject" className="rl-label">Email Subject</label>
          <input
            id="edit-subject"
            type="text"
            name="emailSubject"
            placeholder="e.g. Application for React Role"
            value={formData.emailSubject}
            onChange={handleChange}
            required
            className="rl-input"
          />
        </div>

        <div>
          <label htmlFor="edit-body" className="rl-label">Email Body</label>
          <textarea
            id="edit-body"
            name="emailBody"
            placeholder="Write your email body..."
            rows={7}
            value={formData.emailBody}
            onChange={handleChange}
            required
            className="rl-input resize-y"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
          <button type="button" onClick={() => setShowModal(false)} className="rl-btn-outline">
            Cancel
          </button>
          <button type="submit" className="rl-btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </ModalShell>
  );
};
