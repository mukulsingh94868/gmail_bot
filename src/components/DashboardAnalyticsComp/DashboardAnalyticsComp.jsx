"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  Bookmark,
  Clock,
  FileText,
  Send,
} from "lucide-react";
import PageHeader from "../ui/PageHeader";

const DashboardAnalyticsComp = ({
  fetchSavedData,
  fetchAppliedDatas,
  templateData,
}) => {
  const [timelineData] = useState([
    { name: "Mon", emails: 45, opens: 30, responses: 12 },
    { name: "Tue", emails: 52, opens: 35, responses: 15 },
    { name: "Wed", emails: 38, opens: 25, responses: 10 },
    { name: "Thu", emails: 65, opens: 45, responses: 20 },
    { name: "Fri", emails: 48, opens: 32, responses: 18 },
    { name: "Sat", emails: 25, opens: 15, responses: 8 },
    { name: "Sun", emails: 35, opens: 22, responses: 11 },
  ]);

  const statCards = [
    {
      route: "/saved-mails",
      title: "Saved Jobs",
      value: fetchSavedData?.length || "0",
      icon: Bookmark,
      tile: "bg-rose-50 text-rose-600",
    },
    {
      route: "/recent-mails",
      title: "Applied Jobs",
      value: fetchAppliedDatas?.length || "0",
      icon: Send,
      tile: "bg-brand-50 text-brand-700",
    },
    {
      route: "/template-listing",
      title: "Templates",
      value: templateData?.length || "0",
      icon: FileText,
      tile: "bg-indigo-50 text-brand-500",
    },
  ];

  const quickActions = [
    { label: "Create Template", desc: "Design new email templates", href: "/template-listing", icon: FileText },
    { label: "View Saved", desc: "Check saved job posts", href: "/saved-mails", icon: Bookmark },
    { label: "Recent Activity", desc: "View recent applications", href: "/recent-mails", icon: Clock },
  ];

  return (
    <div className="mx-auto">
      <PageHeader title="Dashboard" description="Track your outreach metrics and activity." />

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Link
            href={card.route}
            key={card.title}
            className="rl-card group flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.tile}`}>
                <card.icon size={22} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <p className="font-display text-3xl font-bold text-slate-900">{card.value}</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-300 transition group-hover:text-brand-600" />
          </Link>
        ))}
      </div>

      {/* Chart & recent applications */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rl-card p-5 sm:p-6 lg:col-span-3">
          <h3 className="mb-4 font-display text-base font-semibold text-slate-900">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timelineData} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4338ca" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#4338ca" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOpened" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e8fd" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e8e8fd",
                  boxShadow: "0 12px 32px -16px rgb(67 56 202 / 0.3)",
                  fontSize: "12px",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="emails" name="Sent" stroke="#4338ca" fill="url(#gradSent)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="opens" name="Opened" stroke="#6366f1" fill="url(#gradOpened)" strokeWidth={2} />
              <Area type="monotone" dataKey="responses" name="Responses" stroke="#f43f5e" fill="url(#gradResp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rl-card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-slate-900">Recent Applications</h3>
            <Link href="/recent-mails" className="text-xs font-semibold text-brand-700 hover:text-brand-900">
              View all
            </Link>
          </div>
          <div className="space-y-2.5">
            {fetchAppliedDatas?.slice(0, 5).length > 0 ? (
              fetchAppliedDatas.slice(0, 5).map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50/30 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{app.positionApplied || "N/A"}</p>
                    <p className="font-mono text-[11px] text-slate-500">
                      {new Date(app.dateAndTime).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Applied
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">No applications yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rl-card p-5 sm:p-6">
        <h3 className="mb-4 font-display text-base font-semibold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              href={action.href}
              key={action.label}
              className="group flex items-center gap-3 rounded-xl border border-brand-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-800 to-brand-500 text-white shadow-sm">
                <action.icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalyticsComp;
