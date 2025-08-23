"use client";

import {
  CircleUserRound,
  FileText,
  LogOut,
  Mail,
  Plus,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getAuthToken, removeAuthToken } from "@/utils/CookieData";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const CandidateHeader = ({ showModal, setShowModal }) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    removeAuthToken("token");
    removeAuthToken("role");
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

  return (
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
                onClick={() => router.push("/recent-mails")}
              >
                <Mail /> Recent Mails
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
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          />
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
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-yellow-700 hover:bg-indigo-50 focus:bg-indigo-100 transition cursor-pointer"
                  onClick={() => {
                    router.push("/recent-mails");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Mail size={15} /> Recent Mails
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
  );
};

export default CandidateHeader;
