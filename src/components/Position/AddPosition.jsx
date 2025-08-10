"use client";

import {
  getPositionChangeData,
  positionApplied,
} from "@/actions/addPositionActions";
import { getAuthToken, removeAuthToken } from "@/utils/CookieData";
import {
  CircleUserRound,
  FileText,
  LogOut,
  Mail,
  Plus,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddPositionModal from "../Modal/Modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AddPosition = (props) => {
  const { fetchOptionsData, fetchAppliedDatas } = props;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [position, setPosition] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [history, setHistory] = useState(fetchAppliedDatas);
  const [showModal, setShowModal] = useState(false);
  const [positionOptions, setPositionOptions] = useState(fetchOptionsData);
  const [userName, setUserName] = useState("");

  const handlePositionChange = async (e) => {
    const selectedName = e.target.value;
    setPosition(selectedName);
    const selected = positionOptions.find((opt) => opt.name === selectedName);
    if (!selected?._id) return;
    setSelectedPositionId(selected._id);
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
      } else {
        toast.error(result?.message || "Failed to record position");
      }
    } catch (error) {
      toast.error("Error recording applied position");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    removeAuthToken();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const decodeJWT = (token) => {
    try {
      const base64Payload = token?.split(".")[1];
      const payload = JSON.parse(atob(base64Payload));
      return payload;
    } catch (err) {
      console.error("Failed to decode token", err);
      return null;
    }
  };

  useEffect(() => {
    setPositionOptions(fetchOptionsData);
  }, [fetchOptionsData]);

  useEffect(() => {
    setHistory(fetchAppliedDatas);
  }, [fetchAppliedDatas]);

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

  console.log("fetchOptionsData", fetchOptionsData);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] px-2 py-0 flex flex-col">
      <header className="w-full bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-blue-700 font-bold tracking-tight">
              RecruitLoop
            </span>
          </div>

          <div className="hidden md:flex gap-2 flex items-center">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all flex gap-2 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <Plus />
              Add Template
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CircleUserRound size={25} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/template-listing")}
                >
                  <FileText /> Templates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User /> {userName}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            {/* Floating card menu */}
            <div className="fixed top-5 right-4 z-50 md:hidden animate-fade-in">
              <div className="rounded-2xl shadow-2xl border border-slate-200 bg-white/95 min-w-[210px] max-w-[90vw] flex flex-col py-2 px-2">
                <button
                  className="self-end text-slate-400 hover:text-blue-700 text-xl px-2 py-1 focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  &times;
                </button>
                <nav className="flex flex-col gap-1 mt-1">
                  <button
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-emerald-700 hover:bg-emerald-50 focus:bg-emerald-100 transition cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Plus size={15} /> Add Template
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-indigo-700 hover:bg-indigo-50 focus:bg-indigo-100 transition cursor-pointer"
                    onClick={() => {
                      router.push("/template-listing");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FileText size={15} /> Templates
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-rose-700 hover:bg-rose-50 focus:bg-rose-100 transition cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </nav>
              </div>
            </div>
            {/* Fade-in animation */}
            <style jsx>{`
              @keyframes fade-in {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fade-in {
                animation: fade-in 0.18s cubic-bezier(0.4, 0, 0.2, 1);
              }
            `}</style>
          </>
        )}
      </header>

      <main className="flex-1 w-full flex flex-col items-center justify-center py-10">
        {fetchOptionsData?.length ? (
          <div className="w-full max-w-2xl bg-white/90 border border-slate-200 shadow-xl rounded-2xl px-8 py-10 flex flex-col gap-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2 text-center tracking-tight">
              Apply for a Position
            </h2>
            <select
              value={position}
              onChange={handlePositionChange}
              className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 text-base"
            >
              <option value="">Select Position</option>
              {positionOptions?.map((pos) => (
                <option key={pos._id} value={pos.name}>
                  {pos.name}
                </option>
              ))}
            </select>

            <input
              type="email"
              placeholder="Enter HR Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 text-base"
            />

            <button
              onClick={handleSendEmail}
              className="w-full text-[13px] cursor-pointer py-3 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-lg text-lg tracking-wide flex justify-center gap-2"
            >
              <Mail /> Send Email
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-white border border-slate-200 shadow-md rounded-xl p-8 flex flex-col items-center text-center">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              No Templates Found
            </h2>
            <p className="text-slate-600 mb-6">
              You haven’t created any templates yet. Please create a template to
              apply for a position.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm cursor-pointer transition-all"
            >
              Create Template
            </button>
          </div>
        )}

        {history?.length > 0 && (
          <div className="w-full max-w-2xl mt-14">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="text-2xl">📜</span> Recent Activity
            </h3>
            <ul className="space-y-4">
              {history?.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white/90 shadow rounded-xl p-5 border border-slate-100 hover:shadow-md transition flex flex-col gap-1"
                >
                  <span className="text-base text-slate-700">
                    <strong>To:</strong> {item.emailApplied}
                  </span>
                  <span className="text-base text-slate-700">
                    <strong>Position:</strong> {item?.positionApplied}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    {new Date(item.dateAndTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {showModal && (
        <AddPositionModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default AddPosition;
