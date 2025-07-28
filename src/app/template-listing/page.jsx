"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/api/api";
import Faq from "@/components/Faq";
import { EditPositionModal } from "@/components/Modal/EditPositionModel";

const TemplatesListing = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem("token");
        const result = await apiRequest({
          url: "http://localhost:5000/api/position/getUserPositions",
          method: "GET",
          token,
        });

        if (result?.statusCode === 200) {
          setTemplates(result?.data || []);
        } else {
          toast.error(result?.message || "Failed to fetch templates");
        }
      } catch (error) {
        toast.error("Network error fetching templates");
      }
    };

    fetchTemplates();
  }, []);

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const result = await apiRequest({
        url: `http://localhost:5000/api/position/getUserPositionsById/${id}`,
        method: "GET",
        token,
      });

      if (result?.statusCode === 200) {
        setCurrentEditData(result?.data);
        setShowEditModal(true);
      } else {
        toast.error(result?.message || "Failed to fetch position details");
      }
    } catch (error) {
      toast.error("Error fetching edit data: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this position?"))
      return;

    try {
      const token = localStorage.getItem("token");

      const result = await apiRequest({
        url: `http://localhost:5000/api/position/deleteUserPositions/${id}`,
        method: "DELETE",
        token,
      });

      if (result?.statusCode === 200) {
        toast.success(result?.message || "Position deleted successfully");
        // Refresh the list after deletion
        const token = localStorage.getItem("token");
        const res = await apiRequest({
          url: "http://localhost:5000/api/position/getUserPositions",
          method: "GET",
          token,
        });
        if (res?.statusCode === 200) {
          setTemplates(res.data || []);
        }
      } else {
        toast.error(result?.message || "Failed to delete position");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          📄 Templates Listing
        </h2>
        {templates?.length === 0 ? (
          <p className="text-gray-500">No templates found.</p>
        ) : (
          <table className="w-full table-auto border border-collapse border-blue-200">
            <thead>
              <tr className="bg-blue-100 text-left text-black">
                <th className="p-3 border">Position</th>
                <th className="p-3 border">Email Subject</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template._id} className="hover:bg-blue-50 text-black">
                  <td className="p-3 border text-sm">{template.position}</td>
                  <td className="p-3 border text-sm">
                    {template.emailSubject}
                  </td>
                  <td className="p-3 border text-sm">
                    {new Date(template.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(template._id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(template._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <Faq />
      </div>

      {showEditModal && currentEditData && (
        <EditPositionModal
          setShowModal={setShowEditModal}
          editData={currentEditData}
          refreshList={() => {
            // re-fetch templates
            const token = localStorage.getItem("token");
            apiRequest({
              url: "http://localhost:5000/api/position/getUserPositions",
              method: "GET",
              token,
            }).then((result) => {
              if (result?.statusCode === 200) {
                setTemplates(result?.data || []);
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default TemplatesListing;
