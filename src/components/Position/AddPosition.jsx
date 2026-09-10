"use client";

import {
  getPositionChangeData,
  positionApplied,
} from "@/actions/addPositionActions";
import { getAuthToken } from "@/utils/CookieData";
import { Mail, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CandidateHeader from "../CandidateHeader/CandidateHeader";
import AddPositionModal from "../Modal/Modal";
import JobSection from "../JobSection/JobSection";
import { decodeJWT } from "@/utils/jwt";

const AddPosition = (props) => {
  const { fetchOptionsData, fetchAppliedDatas } = props;
  const router = useRouter();
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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CandidateHeader showModal={showModal} setShowModal={setShowModal} />

      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          {fetchOptionsData?.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {userName ? `Welcome, ${userName}` : "Apply to positions"}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Pick a position, enter the HR email, and send your application with one click.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={handlePositionChange}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">Select a position</option>
                    {positionOptions?.map((pos) => (
                      <option key={pos._id} value={pos.name}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    HR Email
                  </label>
                  <input
                    type="email"
                    placeholder="hr@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <button
                  onClick={handleSendEmail}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  <Mail size={18} />
                  Send Email
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Mail className="h-6 w-6 text-slate-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                No Templates Yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Create your first email template to start applying for positions.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
              >
                Create Template
              </button>
            </div>
          )}
        </div>

        <div className="mt-12">
          <JobSection />
        </div>
      </main>

      {showModal && (
        <AddPositionModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default AddPosition;
