"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/api/api";
import { EditPositionModal } from "../Modal/EditPositionModel";
import Faq from "../Faq";

const TemplatesListing = (props) => {
    const { templateData } = props;
    console.log('templateData', templateData);
    const router = useRouter();
    const [templates, setTemplates] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentEditData, setCurrentEditData] = useState(null);

    // Fetch all templates
    const fetchTemplates = async () => {
        try {
            const result = await apiRequest({
                url: "position/getUserPositions",
                method: "GET",
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

    useEffect(() => {
        fetchTemplates();
    }, []);

    // Edit handler
    const handleEdit = async (id) => {
        try {
            const result = await apiRequest({
                url: `position/getUserPositionsById/${id}`,
                method: "GET",
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

    // Delete handler
    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this position?");
        if (!confirm) return;

        try {
            const result = await apiRequest({
                url: `position/deleteUserPositions/${id}`,
                method: "DELETE",
            });

            if (result?.statusCode === 200) {
                toast.success(result?.message || "Position deleted successfully");
                fetchTemplates(); // refresh
            } else {
                toast.error(result?.message || "Failed to delete position");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("An error occurred while deleting");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                    📄 <span>Templates Listing</span>
                </h2>

                {templates.length === 0 ? (
                    <p className="text-gray-500">No templates found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-blue-100">
                        <table className="w-full min-w-[600px] table-auto text-sm">
                            <thead className="bg-blue-100 text-blue-800">
                                <tr>
                                    <th className="p-4 text-left">Position</th>
                                    <th className="p-4 text-left">Email Subject</th>
                                    <th className="p-4 text-left">Created At</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template) => (
                                    <tr
                                        key={template._id}
                                        className="border-t hover:bg-blue-50 transition"
                                    >
                                        <td className="p-4">{template.position}</td>
                                        <td className="p-4">{template.emailSubject}</td>
                                        <td className="p-4">
                                            {new Date(template.createdAt).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(template._id)}
                                                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md w-full sm:w-auto"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(template._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md w-full sm:w-auto"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="max-w-4xl mx-auto mt-10">
                <Faq />
            </div>

            {showEditModal && currentEditData && (
                <EditPositionModal
                    setShowModal={setShowEditModal}
                    editData={currentEditData}
                    refreshList={fetchTemplates}
                />
            )}
        </div>
    );
};

export default TemplatesListing;
