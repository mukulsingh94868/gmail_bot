"use client";

import { FileText, Mail, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CandidateHeader from "../CandidateHeader/CandidateHeader";
import toast from "react-hot-toast";
import {
  fetchFollowUpData,
  sendFollowUpMail,
} from "@/actions/addPositionActions";
import { X } from "lucide-react";

const RecentMail = ({ fetchAppliedDatas }) => {
  const router = useRouter();
  const [history, setHistory] = useState(fetchAppliedDatas);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [followUpStatus, setFollowUpStatus] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTemplate, setModalTemplate] = useState("");
  const [headerShowModal, setHeaderShowModal] = useState(false);

  useEffect(() => {
    setHistory(fetchAppliedDatas);
  }, [fetchAppliedDatas]);

  useEffect(() => {
    if (!history || history.length === 0) return;
    const uniqueMap = new Map();
    history.forEach((h) => {
      const key = `${h.emailApplied}___${h.positionApplied}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, { email: h.emailApplied, position: h.positionApplied });
      }
    });
    Array.from(uniqueMap.values()).forEach((item) => {
      fetchFollowUpStatus(item.email, item.position);
    });
  }, [history]);

  const fetchFollowUpStatus = async (email, position) => {
    try {
      const response = await fetchFollowUpData(
        `followUp/check?emailApplied=${encodeURIComponent(email)}&positionApplied=${position}`
      );
      setFollowUpStatus((prev) => ({ ...prev, [email]: response?.data }));
    } catch (err) {
      console.error("Failed to fetch follow-up status", err);
    }
  };

  const sendFollowUpRequest = async ({ emailApplied, positionApplied, originalMailId, template }) => {
    try {
      const payload = { emailApplied, positionApplied, originalMailId, followUpTemplate: template };
      const result = await sendFollowUpMail("followUp/send", payload);
      if (result?.statusCode === 201) return { success: true, data: result };
      return { success: false, error: result?.message || "Something went wrong" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const openFollowUpModal = (row) => {
    setSelectedRow(row);
    setModalTemplate(
      `Hi,\n\nI hope you're well. I'm following up on my application for the ${row.positionApplied} position. I remain very interested and would appreciate any update you can share.\n\nThanks,\n[Your Name]`
    );
    setShowModal(true);
  };

  const closeFollowUpModal = () => {
    setSelectedRow(null);
    setShowModal(false);
  };

  const handleConfirmFollowUp = async () => {
    if (!selectedRow) return;
    const email = selectedRow.emailApplied;
    const position = selectedRow.positionApplied;
    const status = followUpStatus[email] || { followUpCount: 0 };

    if (status.followUpCount >= 3) {
      toast.error("Maximum follow-ups reached for this email");
      return;
    }

    setModalLoading(true);
    const subject = `Follow-up: ${position}`;

    const response = await sendFollowUpRequest({
      emailApplied: email,
      positionApplied: position,
      originalMailId: selectedRow._id || null,
      template: modalTemplate,
    });

    if (!response.success) {
      toast.error(response.error || "Failed to record follow-up");
      setModalLoading(false);
      return;
    }

    toast.success("Follow-up recorded");
    await fetchFollowUpStatus(email, position);
    closeFollowUpModal();

    const isMobile =
      typeof window !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(modalTemplate)}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(modalTemplate)}`,
        "_blank"
      );
    }
    setModalLoading(false);
  };

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
            Recent Activity
          </h2>

          {history?.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item, idx) => {
                      const status = followUpStatus[item.emailApplied] || { followUpCount: 0 };
                      const count = status.followUpCount || 0;
                      const disabled = count >= 3;
                      return (
                        <tr key={idx} className="transition hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="shrink-0 text-slate-400" />
                              <span className="text-sm text-slate-700 break-all">{item.emailApplied}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                              <FileText size={12} />
                              {item.positionApplied}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                            {new Date(item.dateAndTime).toLocaleString("en-GB", {
                              day: "2-digit", month: "short", year: "numeric",
                              hour: "2-digit", minute: "2-digit", hour12: true,
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                  disabled
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                                onClick={() => openFollowUpModal(item)}
                                disabled={disabled}
                              >
                                Follow Up ({count}/3)
                              </button>
                              {disabled && (
                                <span className="text-[10px] font-medium text-red-500">Max</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 sm:hidden">
                {history.map((item, idx) => {
                  const status = followUpStatus[item.emailApplied] || { followUpCount: 0 };
                  const count = status.followUpCount || 0;
                  const disabled = count >= 3;
                  return (
                    <div key={idx} className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 break-all">{item.emailApplied}</span>
                      </div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          {item.positionApplied}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {new Date(item.dateAndTime).toLocaleString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit", hour12: true,
                          })}
                        </span>
                        <button
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                            disabled
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          onClick={() => openFollowUpModal(item)}
                          disabled={disabled}
                        >
                          Follow Up ({count}/3)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <Mail className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up Modal */}
      {showModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeFollowUpModal} />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Send Follow-up</h3>
              <button
                onClick={closeFollowUpModal}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              To: <span className="font-medium text-slate-700">{selectedRow.emailApplied}</span>
              {" "}&mdash;{" "}
              Position: <span className="font-medium text-slate-700">{selectedRow.positionApplied}</span>
            </p>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
            <textarea
              value={modalTemplate}
              onChange={(e) => setModalTemplate(e.target.value)}
              className="w-full min-h-[140px] rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                onClick={closeFollowUpModal}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                onClick={handleConfirmFollowUp}
                disabled={modalLoading}
              >
                {modalLoading && <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {modalLoading ? "Sending..." : "Send Follow-up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentMail;
