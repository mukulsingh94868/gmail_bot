"use client";

import {
  CircleUserRound,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Plus,
  Save,
  HelpCircle,
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
import { decodeJWT } from "@/utils/jwt";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard-analytics", icon: LayoutDashboard },
  { label: "Templates", href: "/template-listing", icon: FileText },
  { label: "Recent Mails", href: "/recent-mails", icon: Mail },
  { label: "Saved Jobs", href: "/saved-mails", icon: Save },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
];

const CandidateHeader = ({ showModal, setShowModal }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    removeAuthToken("token");
    removeAuthToken("role");
    toast.success("Logged out successfully");
    router.push("/");
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span
          className="text-xl font-bold tracking-tight text-blue-600 cursor-pointer select-none"
          onClick={() => router.push("/position")}
        >
          RecruitLoop
        </span>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Template
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
                <CircleUserRound size={22} />
                {userName && (
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {userName}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  className={`cursor-pointer gap-2 ${pathname === item.href ? "bg-blue-50 text-blue-700" : ""}`}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon size={16} />
                  {item.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-16 right-3 z-50 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                setShowModal(true);
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              <Plus size={16} />
              Add Template
            </button>

            <div className="my-1 h-px bg-slate-100" />

            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}

            <div className="my-1 h-px bg-slate-100" />

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default CandidateHeader;
