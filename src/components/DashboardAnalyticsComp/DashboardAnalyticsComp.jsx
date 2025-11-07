"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Mail,
  Users,
  Briefcase,
  Send,
  Clock,
  Repeat,
  ChevronLeft,
} from "lucide-react";

const DashboardAnalyticsComp = ({
  fetchSavedData,
  fetchAppliedDatas,
  templateData,
}) => {
  const router = useRouter();

  const [timelineData] = useState([
    { name: "Mon", emails: 45, opens: 30, responses: 12 },
    { name: "Tue", emails: 52, opens: 35, responses: 15 },
    { name: "Wed", emails: 38, opens: 25, responses: 10 },
    { name: "Thu", emails: 65, opens: 45, responses: 20 },
    { name: "Fri", emails: 48, opens: 32, responses: 18 },
    { name: "Sat", emails: 25, opens: 15, responses: 8 },
    { name: "Sun", emails: 35, opens: 22, responses: 11 },
  ]);

  const CardData = [
    {
      route: "/saved-mails",
      title: "Saved Jobs",
      value: fetchSavedData?.length || "-",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      route: "/recent-mails",
      title: "Applied Jobs",
      value: fetchAppliedDatas?.length || "-",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      icon: <Send className="w-6 h-6" />,
    },
    {
      route: "/template-listing",
      title: "Templates Created",
      value: templateData?.length || "-",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      icon: <Mail className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          className="flex items-center mb-6 px-4 py-2 text-slate-600 hover:text-slate-800 bg-white rounded-lg shadow-sm border border-slate-200 transition-colors"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center">
          Analytics Dashboard
        </h1>
        <p className="text-slate-600 mt-2 text-center">
          Track your recruitment metrics and performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {CardData.map((card, index) => (
          <Link href={card.route} key={index}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${card.bgColor} rounded-xl`}>
                  <div className={card.color}>{card.icon}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {card.title}
                  </p>
                  <h3 className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="text-xs text-slate-500">View Details →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Email Activity Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="emails"
                name="Emails Sent"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="opens"
                name="Emails Opened"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="responses"
                name="Responses"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Applications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {fetchAppliedDatas?.slice(0, 5).map((application, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">
                      {application.positionApplied || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(application.dateAndTime).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Applied
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/template-listing">
            <div className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <Mail className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-slate-800">Create Template</h4>
              <p className="text-sm text-slate-600 mt-1">
                Design new email templates
              </p>
            </div>
          </Link>
          <Link href="/saved-mails">
            <div className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <Briefcase className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-medium text-slate-800">View Saved</h4>
              <p className="text-sm text-slate-600 mt-1">
                Check saved job posts
              </p>
            </div>
          </Link>
          <Link href="/recent-mails">
            <div className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <Clock className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-medium text-slate-800">Recent Activity</h4>
              <p className="text-sm text-slate-600 mt-1">
                View recent applications
              </p>
            </div>
          </Link>
          <div className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            <Users className="w-6 h-6 text-orange-600 mb-2" />
            <h4 className="font-medium text-slate-800">Network</h4>
            <p className="text-sm text-slate-600 mt-1">
              Connect with recruiters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalyticsComp;
