"use client";

import { getPositionChangeData, positionApplied } from "@/actions/addPositionActions";
import { apiRequest } from "@/api/api";
import { removeAuthToken } from "@/utils/CookieData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddPositionModal from "../Modal/Modal";
// import { removeAuthToken } from "@/utils/CookieData";

const AddPosition = (props) => {
  const { fetchOptionsData, fetchAppliedDatas } = props;
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [selectedPositionId, setSelectedPositionId] = useState("");
  const [selectedData, setSelectedData] = useState(null);
  const [history, setHistory] = useState(fetchAppliedDatas);
  const [showModal, setShowModal] = useState(false);
  const [positionOptions, setPositionOptions] = useState(fetchOptionsData);

  const handlePositionChange = async (e) => {
    const selectedName = e.target.value;
    setPosition(selectedName);
    const selected = positionOptions.find((opt) => opt.name === selectedName);
    if (!selected?._id) return;
    setSelectedPositionId(selected._id);
    try {
      const result = await getPositionChangeData(`position/postionRecord/${selected._id}`);
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

    const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(
      selectedData?.[0]?.emailSubject
    )}&body=${encodeURIComponent(selectedData?.[0]?.emailBody)}`;
    window.open(gmailURL, "_blank");

    const payload = {
      emailApplied: email,
      positionApplied: position,
      dateAndTime: new Date().toISOString(),
    };
    try {
      const result = await positionApplied('apply/position-applied', payload);
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

  useEffect(() => {
    setPositionOptions(fetchOptionsData);
  }, [fetchOptionsData]);

  useEffect(() => {
    setHistory(fetchAppliedDatas);
  }, [fetchAppliedDatas]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-2">
            📧 <span>RecruitLoop</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-full shadow transition-all"
              onClick={() => setShowModal(true)}
            >
              ➕ Add Position
            </button>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-full shadow transition-all"
              onClick={() => router.push("/template-listing")}
            >
              📋 Templates
            </button>
            <button
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-full shadow transition-all"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl px-6 py-8 space-y-6">
          <select
            value={position}
            onChange={handlePositionChange}
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSendEmail}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow"
          >
            ✉️ Send Email
          </button>
        </div>

        {history?.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12">
            <h3 className="text-2xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
              📜 <span>Recent Activity</span>
            </h3>
            <ul className="space-y-4">
              {history.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white shadow-sm rounded-lg p-5 border border-gray-100 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-800">
                    <strong>To:</strong> {item.emailApplied}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Position:</strong> {item.positionApplied}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.dateAndTime).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showModal && (
        <AddPositionModal showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
};

export default AddPosition;
