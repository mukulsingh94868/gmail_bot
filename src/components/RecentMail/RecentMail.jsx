"use client";

import { CheckCheck, ChevronLeft, ChevronRight, ChevronsUpDown, Clock, Mail, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchFollowUpData,
  sendFollowUpMail,
} from "@/actions/addPositionActions";
import PageHeader from "../ui/PageHeader";
import EmptyState from "../ui/EmptyState";
import ModalShell from "../ui/ModalShell";

const MAX_FOLLOW_UPS = 3;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });

const getDomain = (email = "") => email.split("@")[1] || "";

const FollowUpStatus = ({ count, onFollowUp }) => {
  const disabled = count >= MAX_FOLLOW_UPS;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${disabled ? "bg-rose-50 text-rose-600" : "bg-brand-50 text-brand-800"
          }`}
      >
        <span className="inline-flex gap-0.5" aria-hidden="true">
          {Array.from({ length: MAX_FOLLOW_UPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i < count ? (disabled ? "bg-rose-500" : "bg-brand-700") : "bg-brand-200"
                }`}
            />
          ))}
        </span>
        Follow Up ({count}/{MAX_FOLLOW_UPS})
      </span>
      <button
        onClick={onFollowUp}
        disabled={disabled}
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : "cursor-pointer bg-linear-to-r from-brand-900 to-brand-700 text-white shadow-sm hover:from-brand-950 hover:to-brand-800"
          }`}
      >
        <Send size={11} />
        {disabled ? "Max reached" : "Send Follow-up"}
      </button>
    </div>
  );
};

const RecentMail = ({ fetchAppliedDatas }) => {
  const [history, setHistory] = useState(fetchAppliedDatas);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [followUpStatus, setFollowUpStatus] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTemplate, setModalTemplate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Client-side pagination (presentation only)
  const total = history?.length || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = history?.slice(startIndex, startIndex + pageSize) || [];

  const getCount = (item) => (followUpStatus[item.emailApplied] || { followUpCount: 0 }).followUpCount || 0;

  return (
    <div className="mx-auto">
      <PageHeader
        title="Recent Activity"
        description="Track sent applications and manage your follow-up cadence."
      />

      {history?.length > 0 ? (
        <div className="rl-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50/60">
                  <th className="rl-th">Recipient Email</th>
                  <th className="rl-th">Applied Position</th>
                  <th className="rl-th">Dispatch Date &amp; Time</th>
                  <th className="rl-th">Status &amp; Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100/70">
                {pageRows.map((item, idx) => (
                  <tr key={item._id || startIndex + idx} className="transition hover:bg-brand-50/40">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                          <Mail size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">{item.emailApplied}</p>
                          <p className="truncate font-mono text-[11px] text-slate-400">{getDomain(item.emailApplied)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                        {item.positionApplied}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600">
                        <CheckCheck size={13} className="text-emerald-500" />
                        {formatDate(item.dateAndTime)}
                        <span className="text-slate-300">·</span>
                        {formatTime(item.dateAndTime)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <FollowUpStatus count={getCount(item)} onFollowUp={() => openFollowUpModal(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-brand-100/70 md:hidden">
            {pageRows.map((item, idx) => (
              <li key={item._id || startIndex + idx} className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Mail size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium text-slate-900">{item.emailApplied}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
                      {item.positionApplied}
                    </p>
                  </div>
                </div>
                <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                  <Clock size={12} />
                  {formatDate(item.dateAndTime)} · {formatTime(item.dateAndTime)}
                </p>
                <FollowUpStatus count={getCount(item)} onFollowUp={() => openFollowUpModal(item)} />
              </li>
            ))}
          </ul>

          {/* Footer / pagination */}
          <div className="flex flex-col gap-3 border-t border-brand-100 bg-brand-50/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {startIndex + 1}–{Math.min(startIndex + pageSize, total)}
              </span>{" "}
              of <span className="font-semibold text-slate-800">{total}</span> applications
            </p>
            <div className="flex items-center gap-3">
              <label htmlFor="rows-per-page" className="text-xs text-slate-500">
                Rows per page
              </label>
              <div className="relative">
                <select
                  id="rows-per-page"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rl-input cursor-pointer appearance-none bg-white py-1 pl-2.5 pr-7 text-xs"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <ChevronsUpDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rl-icon-btn disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="min-w-7 rounded-lg bg-white px-2 py-1 text-center font-mono text-xs font-semibold text-brand-800 shadow-sm">
                  {currentPage}
                </span>
                <button
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rl-icon-btn disabled:pointer-events-none disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Mail}
          title="No recent activity"
          description="Applications you send from the Send Email page will show up here."
        />
      )}

      {/* Follow-up modal */}
      {showModal && selectedRow && (
        <ModalShell
          title="Send Follow-up"
          description="Review the message before it opens in Gmail."
          icon={Send}
          onClose={closeFollowUpModal}
        >
          <div className="mb-4 grid gap-2 rounded-xl bg-brand-50/70 p-3 text-sm sm:grid-cols-2">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">To</p>
              <p className="truncate font-medium text-slate-800">{selectedRow.emailApplied}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Position</p>
              <p className="truncate font-medium text-slate-800">{selectedRow.positionApplied}</p>
            </div>
          </div>
          <label htmlFor="followup-message" className="rl-label">Message</label>
          <textarea
            id="followup-message"
            value={modalTemplate}
            onChange={(e) => setModalTemplate(e.target.value)}
            className="rl-input min-h-[180px] resize-y"
          />
          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-brand-100 pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <button className="rl-btn-outline" onClick={closeFollowUpModal} disabled={modalLoading}>
              Cancel
            </button>
            <button className="rl-btn-primary" onClick={handleConfirmFollowUp} disabled={modalLoading}>
              {modalLoading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send size={15} />
              )}
              {modalLoading ? "Sending..." : "Send Follow-up"}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
};

export default RecentMail;
