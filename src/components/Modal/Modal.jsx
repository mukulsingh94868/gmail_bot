"use client";
import React, { useState } from 'react'

const AddPositionModal = (props) => {
    const { setShowModal } = props;

    const [positionApplied, setPositionApplied] = useState({
        position: '',
        emailSubject: '',
        emailBody: ''
    });

    const handleAddPosition = (e) => {
        e.preventDefault();
        console.log('hello world', positionApplied);
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPositionApplied((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Add New Position</h2>
                <form onSubmit={handleAddPosition} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="position"
                        placeholder="Position Applied"
                        value={positionApplied.position}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
                        required
                    />

                    <input
                        type="text"
                        name="emailSubject"
                        placeholder="Email Subject"
                        value={positionApplied.emailSubject}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
                        required
                    />

                    <textarea
                        name="emailBody"
                        placeholder="Email Body"
                        value={positionApplied.emailBody}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 min-h-[100px]"
                        required
                    />
                    <div className="flex gap-4 justify-end mt-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400 transition"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPositionModal