"use client";

import { getAuthToken, removeAuthToken } from "@/utils/CookieData";
import { CircleUserRound, FileText, LogOut, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const RecruiterHeader = ({ showJobModal, setShowJobModal }) => {
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
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-emerald-600">
            RecruitLoop
          </span>
        </div>

        {/* Right Side */}
        <div className="flex w-full sm:w-auto items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
          {/* Add Job Post Button */}
          <button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all flex gap-2 cursor-pointer w-full sm:w-auto text-base sm:text-base"
            onClick={() => setShowJobModal(true)}
          >
            <Plus />
            Add Job Post
          </button>

          {/* Profile dropdown - only desktop */}
          <div className="hidden sm:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CircleUserRound size={25} className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
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

          {/* Burger menu - only mobile */}
          <div className="sm:hidden flex items-center">
            <button
              className="p-2 rounded-md text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-gray-50 border-t border-gray-200 p-4 space-y-3">
          <p className="flex items-center gap-2">
            <User /> {userName}
          </p>
          <button
            className="flex items-center gap-2 text-red-600"
            onClick={handleLogout}
          >
            <LogOut /> Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default RecruiterHeader;
