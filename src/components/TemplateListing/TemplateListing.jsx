"use client";

import {
  deleteUserPositions,
  getUserPositionsById,
} from "@/actions/templateListingActons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit3, Trash2, ChevronLeft, FileText, Mail } from "lucide-react";
import { EditPositionModal } from "../Modal/EditPositionModel";
import CandidateHeader from "../CandidateHeader/CandidateHeader";

const TemplatesListing = (props) => {
  const { templateData } = props;
  const router = useRouter();
  const [templates, setTemplates] = useState(templateData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [headerShowModal, setHeaderShowModal] = useState(false);

  const handleEdit = async (id) => {
    try {
      const result = await getUserPositionsById(`position/getUserPositionsById/${id}`);
      if (result?.statusCode === 200) {
        setCurrentEditData(result?.data);
        setShowEditModal(true);
      } else {
        toast.error(result?.message || "Failed to fetch position details");
      }
    } catch (error) {
      toast.error("Error fetching edit data");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this template?");
    if (!confirm) return;
    try {
      const result = await deleteUserPositions(`position/deleteUserPositions/${id}`);
      if (result?.statusCode === 200) {
        toast.success(result?.message || "Template deleted successfully");
        setTemplates((prev) => prev.filter((t) => t._id !== id));
      } else {
        toast.error(result?.message || "Failed to delete template");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  useEffect(() => {
    setTemplates(templateData);
  }, [templateData]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CandidateHeader showModal={headerShowModal} setShowModal={setHeaderShowModal} />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <button
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Templates
          </h2>

          {!templates || templates.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No templates found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Created</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {templates.map((template) => (
                      <tr key={template?._id} className="transition hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">{template?.position}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                          {template?.emailSubject}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                          {new Date(template?.createdAt)?.toLocaleString("en-GB", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit", hour12: true,
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(template?._id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(template?._id)}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 sm:hidden">
                {templates.map((template) => (
                  <div key={template?._id} className="p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{template?.position}</span>
                    </div>
                    <p className="mb-2 text-xs text-slate-500 truncate">{template?.emailSubject}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {new Date(template?.createdAt)?.toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(template?._id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(template?._id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && currentEditData && (
        <EditPositionModal setShowModal={setShowEditModal} editData={currentEditData} />
      )}
    </div>
  );
};

export default TemplatesListing;
