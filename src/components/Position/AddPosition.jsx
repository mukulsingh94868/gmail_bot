"use client";

import {
  getPositionChangeData,
  positionApplied,
} from "@/actions/addPositionActions";
import { getAuthToken } from "@/utils/CookieData";
import {
  AtSign,
  ChevronsUpDown,
  ExternalLink,
  FileText,
  Mail,
  Plus,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddPositionModal from "../Modal/Modal";
import JobSection from "../JobSection/JobSection";
import EmptyState from "../ui/EmptyState";
import { decodeJWT } from "@/utils/jwt";

const AddPosition = (props) => {
  const { fetchOptionsData } = props;
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [positionOptions, setPositionOptions] = useState(fetchOptionsData);
  const [userName, setUserName] = useState("");

  const handlePositionChange = async (e) => {
    const selectedName = e.target.value;
    setPosition(selectedName);
    const selected = positionOptions.find((opt) => opt.name === selectedName);
    if (!selected?._id) return;
    try {
      const result = await getPositionChangeData(
        `position/postionRecord/${selected._id}`
      );
      if (result?.statusCode === 200) {
        setSelectedData(result?.data || {});
      } else {
        toast.error(result?.message || "Failed to fetch position data");
      }
    } catch (err) {
      toast.error("Error loading position data");
    }
  };

  const handleSendEmail = async () => {
    if (!email || !selectedData || !position) {
      toast.error("Please enter email and select position.");
      return;
    }

    const isMobile =
      typeof window !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    const subject = selectedData?.[0]?.emailSubject || "";
    const body = selectedData?.[0]?.emailBody || "";

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

    const payload = {
      emailApplied: email,
      positionApplied: position,
      dateAndTime: new Date().toISOString(),
    };
    try {
      const result = await positionApplied("apply/position-applied", payload);
      if (result?.statusCode === 201) {
        toast.success(result?.message || "Successfully sent email");
        setEmail("");
        setPosition("");
      } else {
        toast.error(result?.message || "Failed to record position");
      }
    } catch (error) {
      toast.error("Error recording applied position");
    }
  };

  useEffect(() => {
    setPositionOptions(fetchOptionsData);
  }, [fetchOptionsData]);

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded?.name) {
          setUserName(decoded.name);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const paramEmail = searchParams.get("emailId");
    if (paramEmail) {
      setEmail(paramEmail);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-full space-y-8 sm:space-y-12">
      <section className="mx-auto w-full max-w-xl lg:max-w-2xl">
        <div className="mb-6 text-center">
          {userName && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand-800">
              <Sparkles size={12} />
              Welcome, {userName}
            </span>
          )}
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Send Application Email
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Select your email pitch template, enter the recruiter&apos;s email, and launch directly in Gmail.
          </p>
        </div>

        {fetchOptionsData?.length ? (
          <div className="rl-card p-5 sm:p-7">
            <div className="space-y-5">
              <div>
                <label htmlFor="send-template" className="rl-label">
                  <FileText size={15} className="text-brand-700" />
                  Choose Template
                </label>
                <div className="relative">
                  <select
                    id="send-template"
                    value={position}
                    onChange={handlePositionChange}
                    className="rl-input cursor-pointer appearance-none pr-10"
                  >
                    <option value="">Select a position template</option>
                    {positionOptions?.map((pos) => (
                      <option key={pos._id} value={pos.name}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="send-email" className="rl-label">
                  <AtSign size={15} className="text-brand-700" />
                  HR / Recruiter Email
                </label>
                <div className="relative">
                  <input
                    id="send-email"
                    type="email"
                    placeholder="e.g. hr@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rl-input pr-10"
                    autoComplete="off"
                  />
                  <Mail
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <button onClick={handleSendEmail} className="rl-btn-primary w-full py-3">
                <Mail size={17} />
                Open &amp; Send in Gmail
                <ExternalLink size={15} className="opacity-80" />
              </button>
              <p className="-mt-2 text-center text-xs text-slate-500">
                Opens Gmail on desktop or your mail app on mobile, with your template pre-filled.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-brand-100 pt-4 text-xs">
              <span className="text-slate-500">Need a different pitch?</span>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex cursor-pointer items-center gap-1 font-semibold text-brand-700 transition hover:text-brand-900"
              >
                <Plus size={14} />
                New template
              </button>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Mail}
            title="No Templates Yet"
            description="Create your first email template to start applying for positions."
            action={
              <button onClick={() => setShowModal(true)} className="rl-btn-primary">
                <Plus size={16} />
                Create Template
              </button>
            }
          />
        )}
      </section>

      <JobSection />

      {showModal && (
        <AddPositionModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default AddPosition;
