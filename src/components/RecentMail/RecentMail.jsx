"use client";

import { FileText, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CandidateHeader from "../CandidateHeader/CandidateHeader";
import toast from "react-hot-toast";
import {
  fetchFollowUpData,
  sendFollowUpMail,
} from "@/actions/addPositionActions";

const RecentMail = ({ fetchAppliedDatas }) => {
  const router = useRouter();
  const [history, setHistory] = useState(fetchAppliedDatas);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [followUpStatus, setFollowUpStatus] = useState({}); // { email: { followUpCount, canFollowUp, lastFollowUpDate } }
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTemplate, setModalTemplate] = useState("");

  useEffect(() => {
    setHistory(fetchAppliedDatas);
  }, [fetchAppliedDatas]);

  // Fetch follow-up status for each unique email in history
  useEffect(() => {
    if (!history || history.length === 0) return;
    const unique = [...new Set(history.map((h) => h.emailApplied))];
    unique.forEach((email) => {
      fetchFollowUpStatus(email);
    });
  }, [history]);

  const fetchFollowUpStatus = async (email) => {
    try {
      const response = await fetchFollowUpData(
        `followUp/check?emailApplied=${encodeURIComponent(email)}`
      );
      setFollowUpStatus((prev) => ({ ...prev, [email]: response?.data }));
    } catch (err) {
      console.error("Failed to fetch follow-up status", err);
    }
  };

  const sendFollowUpRequest = async ({
    emailApplied,
    positionApplied,
    originalMailId,
    template,
  }) => {
    try {
      const payload = {
        emailApplied,
        positionApplied,
        originalMailId,
        followUpTemplate: template,
      };

      const result = await sendFollowUpMail("followUp/send", payload);

      if (result?.statusCode === 201) {
        toast.success(result?.message || "Follow-up sent successfully");

        return {
          ok: true,
          json: result,
        };
      } else {
        toast.error(result?.message);

        return {
          ok: false,
          json: result,
        };
      }
    } catch (err) {
      console.error("sendFollowUpRequest error", err);
      return {
        ok: false,
        json: { message: err.message },
      };
    }
  };

  const openFollowUpModal = (row) => {
    setSelectedRow(row);
    const defaultTemplate = `Hi,\n\nI hope you're well. I'm following up on my application for the ${row.positionApplied} position. I remain very interested and would appreciate any update you can share.\n\nThanks,\n[Your Name]`;
    setModalTemplate(defaultTemplate);
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

    const isMobile =
      typeof window !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const subject = `Follow-up: ${position}`;
    const body = modalTemplate;

    // === Open mail client ===
    if (isMobile) {
      const mailto = `mailto:${encodeURIComponent(
        email
      )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`;
      window.location.href = mailto;
    } else {
      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        email
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailURL, "_blank");
    }

    // === Record follow-up ===
    const { ok, json } = await sendFollowUpRequest({
      emailApplied: email,
      positionApplied: position,
      originalMailId: selectedRow._id || null,
      template: modalTemplate,
    });

    if (ok) {
      toast.success(json?.message || "Follow-up recorded");
      await fetchFollowUpStatus(email);
      closeFollowUpModal();
    } else {
      toast.error(json?.message || "Failed to record follow-up");
    }

    setModalLoading(false);
  };

  return (
    <>
      {/* <CandidateHeader showModal={showModal} setShowModal={setShowModal} /> */}
      <div className="w-full flex justify-center px-2 sm:px-6 md:px-12 lg:px-0">
        {history?.length > 0 && (
          <div className="w-full max-w-4xl mt-10">
            <div className="mb-10">
              <button
                className="flex items-center mb-4 bg-gray-200  px-2 py-0 max-h-fit rounded h-8  justify-center gap-x-1 cursor-pointer"
                onClick={() => router.back()}
              >
                <span className="text-[25px] mb-1">←</span>
                <span className="text-[15px]">Back</span>
              </button>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2 border-b border-slate-200 pb-4">
              <span className="text-3xl">📜</span> Recent Activity
            </h3>
            <div className="overflow-x-auto rounded-2xl shadow-md bg-white">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-4 text-base text-slate-800 font-medium flex items-center gap-2 whitespace-nowrap">
                        <Mail className="text-blue-600" size={18} />
                        <span className="break-all">{item.emailApplied}</span>
                      </td>
                      <td className="px-4 py-4 text-base text-blue-700 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="text-indigo-600" size={16} />
                          <span className="bg-blue-100 px-2 py-1 rounded-md text-sm">
                            {item?.positionApplied}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                        {new Date(item?.dateAndTime).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                        {/* Actions: Follow Up button with count */}
                        {(() => {
                          const status = followUpStatus[item.emailApplied] || {
                            followUpCount: 0,
                          };
                          const count = status.followUpCount || 0;
                          const disabled = count >= 3;
                          return (
                            <div className="flex items-center gap-2">
                              <button
                                className={`px-3 py-1 rounded-md text-sm font-medium ${
                                  disabled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:shadow-md"
                                }`}
                                onClick={() => openFollowUpModal(item)}
                                disabled={disabled}
                              >
                                Follow Up ({count}/3)
                              </button>
                              {disabled && (
                                <span className="text-xs text-red-600 font-medium">
                                  Max
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Follow-up Modal */}
      {showModal && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeFollowUpModal}
          ></div>
          <div className="relative bg-white rounded-lg shadow-lg w-[min(95%,600px)] mx-4 p-6">
            <h3 className="text-lg font-semibold mb-2">Send Follow-up</h3>
            <p className="text-sm text-slate-600 mb-4">
              To:{" "}
              <span className="font-medium">{selectedRow.emailApplied}</span> —
              Position:{" "}
              <span className="font-medium">{selectedRow.positionApplied}</span>
            </p>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={modalTemplate}
              onChange={(e) => setModalTemplate(e.target.value)}
              className="w-full min-h-[140px] border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 text-sm"
                onClick={closeFollowUpModal}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm disabled:opacity-60"
                onClick={handleConfirmFollowUp}
                disabled={modalLoading}
              >
                {modalLoading ? "Sending..." : "Send Follow-up"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentMail;
