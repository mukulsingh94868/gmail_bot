"use client";

import { editUserPositions } from "@/actions/addPositionActions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowModal(false)}
      />
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Template</h2>
            <p className="mt-0.5 text-sm text-slate-500">Update your email template</p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Position</label>
            <input
              type="text"
              name="position"
              placeholder="e.g. React Developer"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Subject</label>
            <input
              type="text"
              name="emailSubject"
              placeholder="e.g. Application for React Role"
              value={formData.emailSubject}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Body</label>
            <textarea
              name="emailBody"
              placeholder="Write your email body..."
              rows={5}
              value={formData.emailBody}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
