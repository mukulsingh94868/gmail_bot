"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Bookmark,
  Briefcase,
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Send,
  X,
} from "lucide-react";
import { removeAuthToken } from "@/utils/CookieData";
import Footer from "../Footer/Footer";
import JobPost from "../Modal/JobPost";
import Logo from "../ui/Logo";

const candidateNav = [
  { label: "Send Email", href: "/position", icon: Send },
  { label: "Dashboard", href: "/dashboard-analytics", icon: LayoutDashboard },
  { label: "Templates", href: "/template-listing", icon: FileText, countKey: "templates" },
  { label: "Recent Activity", href: "/recent-mails", icon: Clock, countKey: "recent" },
  // Saved Jobs: disabled for now
  // { label: "Saved Jobs", href: "/saved-mails", icon: Bookmark },
  { label: "FAQ & Help", href: "/faq", icon: HelpCircle },
];

const recruiterNav = [
  { label: "Job Posts", href: "/recruiter-dashboard", icon: Briefcase },
];

const isActivePath = (pathname, href) =>
  pathname === href || pathname.startsWith(`${href}/`);

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const AppShell = ({ children, role, user = {}, counts = {} }) => {
  const router = useRouter();
  const pathname = usePathname() || "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const isRecruiter = role === "recruiter" || pathname.startsWith("/recruiter-dashboard");
  const navItems = isRecruiter ? recruiterNav : candidateNav;
  const homeHref = isRecruiter ? "/recruiter-dashboard" : "/position";
  const activeItem = navItems.find((item) => isActivePath(pathname, item.href));
  const isDetailPage = /^\/(position|recruiter-dashboard)\/[^/]+$/.test(pathname);
  // Mobile-only back button: skip on the home screen (nothing to go back to)
  // and on detail pages, which already have their own back button.
  const showMobileBack = pathname !== homeHref && !isDetailPage;
  const displayName = user.name || (isRecruiter ? "Recruiter" : "Candidate");
  const initials = getInitials(displayName);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.clear();
    removeAuthToken("token");
    removeAuthToken("role");
    toast.success("Logged out successfully");
    router.push("/");
  };

  const renderSidebar = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-brand-100 px-5">
        <Logo href={homeHref} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
          Workspace
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const count = item.countKey ? counts?.[item.countKey] : undefined;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-linear-to-r from-brand-800 to-brand-600 text-white shadow-md shadow-brand-700/25"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <item.icon size={17} className="shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {typeof count === "number" && (
                    <span
                      className={`min-w-6 rounded-full px-2 py-0.5 text-center text-[11px] font-semibold ${
                        active ? "bg-white/20 text-white" : "bg-brand-100 text-brand-800"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-brand-100 bg-white/60 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-700 to-brand-500 text-sm font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
            {user.email && <p className="truncate text-xs text-slate-500">{user.email}</p>}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-brand-100 bg-panel lg:block">
        {renderSidebar()}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-panel shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="rl-icon-btn absolute right-3 top-4 z-10"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {renderSidebar()}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-brand-100 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <button
            className="rl-icon-btn -ml-1 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="lg:hidden">
            <Logo href={homeHref} />
          </div>

          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-sm lg:flex">
            <span className="text-slate-500">Workspace</span>
            <ChevronRight size={14} className="shrink-0 text-slate-300" />
            {isDetailPage ? (
              <>
                <Link
                  href={activeItem?.href || homeHref}
                  className="truncate text-slate-500 transition hover:text-slate-800"
                >
                  {isRecruiter ? "Job Posts" : "Available Jobs"}
                </Link>
                <ChevronRight size={14} className="shrink-0 text-slate-300" />
                <span className="truncate font-semibold text-slate-900">Job Details</span>
              </>
            ) : (
              <span className="truncate font-semibold text-slate-900">{activeItem?.label}</span>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {isRecruiter && (
              <button
                onClick={() => setShowJobModal(true)}
                className="rl-btn-primary px-3 py-2 sm:px-4"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Job Post</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            <span
              title={displayName}
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-brand-700 to-brand-500 text-xs font-bold text-white shadow ring-2 ring-white sm:flex"
            >
              {initials}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {showMobileBack && (
            <button
              onClick={() => router.back()}
              className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg py-1 text-sm font-semibold text-slate-500 transition hover:text-brand-700 lg:hidden"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          {children}
        </main>

        <Footer />
      </div>

      {showJobModal && <JobPost setShowJobModal={setShowJobModal} />}
    </div>
  );
};

export default AppShell;
