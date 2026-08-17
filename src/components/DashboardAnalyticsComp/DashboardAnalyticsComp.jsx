"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Mail,
  Briefcase,
  Send,
  Clock,
  ChevronLeft,
  ArrowUpRight,
} from "lucide-react";
import CandidateHeader from "../CandidateHeader/CandidateHeader";

const DashboardAnalyticsComp = ({
  fetchSavedData,
  fetchAppliedDatas,
  templateData,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

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
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      route: "/recent-mails",
      title: "Applied Jobs",
      value: fetchAppliedDatas?.length || "0",
      icon: Send,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      route: "/template-listing",
      title: "Templates",
      value: templateData?.length || "0",
      icon: Mail,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  const quickActions = [
    { label: "Create Template", desc: "Design new email templates", href: "/template-listing", icon: Mail, color: "text-blue-600" },
    { label: "View Saved", desc: "Check saved job posts", href: "/saved-mails", icon: Briefcase, color: "text-emerald-600" },
    { label: "Recent Activity", desc: "View recent applications", href: "/recent-mails", icon: Clock, color: "text-violet-600" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CandidateHeader showModal={showModal} setShowModal={setShowModal} />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <button
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
              onClick={() => router.back()}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your recruitment metrics and activity
            </p>
          </div>

          {/* Stat Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statCards.map((card) => (
              <Link href={card.route} key={card.title}>
                <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{card.title}</p>
                        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-slate-300 transition group-hover:text-slate-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Charts & Table */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="emails" name="Sent" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="opens" name="Opened" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="responses" name="Responses" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Recent Applications</h3>
              <div className="space-y-3">
                {fetchAppliedDatas?.slice(0, 5).length > 0 ? (
                  fetchAppliedDatas.slice(0, 5).map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{app.positionApplied || "N/A"}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(app.dateAndTime).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="shrink-0 ml-3 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
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

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <Link href={action.href} key={action.label}>
                  <div className="group flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalyticsComp;
