"use client";

import {
  deleteUserPositions,
  getUserPositionsById,
} from "@/actions/templateListingActions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { EditPositionModal } from "../Modal/EditPositionModal";
import AddPositionModal from "../Modal/Modal";
import PageHeader from "../ui/PageHeader";
import EmptyState from "../ui/EmptyState";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });

const TemplatesListing = (props) => {
  const { templateData } = props;
  const [templates, setTemplates] = useState(templateData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const renderActions = (template) => (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => handleEdit(template?._id)}
        className="rl-icon-btn"
        title="Edit"
        aria-label={`Edit ${template?.position} template`}
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={() => handleDelete(template?._id)}
        className="rl-icon-btn hover:bg-rose-50 hover:text-rose-600"
        title="Delete"
        aria-label={`Delete ${template?.position} template`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div className="mx-auto">
      <PageHeader
        title="Application Templates"
        description="Manage role-specific email pitches for your outreach. Pick one on the Send Email page to apply."
        actions={
          <button onClick={() => setShowCreateModal(true)} className="rl-btn-primary">
            <Plus size={16} />
            Create Template
          </button>
        }
      />

      {!templates || templates.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No templates found"
          description="Create a template with a subject and body you can reuse for every application."
          action={
            <button onClick={() => setShowCreateModal(true)} className="rl-btn-primary">
              <Plus size={16} />
              Create Template
            </button>
          }
        />
      ) : (
        <div className="rl-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/60">
                  <th className="rl-th">Target Position</th>
                  <th className="rl-th">Email Subject Line</th>
                  <th className="rl-th">Created</th>
                  <th className="rl-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/70">
                {templates.map((template) => (
                  <tr key={template?._id} className="transition hover:bg-brand-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                          <FileText size={16} />
                        </span>
                        <span className="font-display text-sm font-semibold text-slate-900">
                          {template?.position}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-[340px] truncate px-4 py-3.5 text-sm text-slate-600">
                      {template?.emailSubject}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs">
                      <span className="block text-slate-700">{formatDate(template?.createdAt)}</span>
                      <span className="block text-slate-400">{formatTime(template?.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3.5">{renderActions(template)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-brand-100/70 md:hidden">
            {templates.map((template) => (
              <li key={template?._id} className="flex items-start gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <FileText size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-slate-900">{template?.position}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{template?.emailSubject}</p>
                  <p className="mt-1.5 font-mono text-[11px] text-slate-400">
                    {formatDate(template?.createdAt)}
                  </p>
                </div>
                {renderActions(template)}
              </li>
            ))}
          </ul>

          <div className="border-t border-brand-100 bg-brand-50/40 px-4 py-3 font-mono text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800">{templates.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{templates.length}</span> templates
          </div>
        </div>
      )}

      {showEditModal && currentEditData && (
        <EditPositionModal setShowModal={setShowEditModal} editData={currentEditData} />
      )}
      {showCreateModal && (
        <AddPositionModal showModal={showCreateModal} setShowModal={setShowCreateModal} />
      )}
    </div>
  );
};

export default TemplatesListing;
