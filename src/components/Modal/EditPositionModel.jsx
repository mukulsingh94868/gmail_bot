import toast from "react-hot-toast";

const { apiRequest } = require("@/api/api");
const { useState, useEffect } = require("react");

export const EditPositionModal = ({ setShowModal, editData, refreshList }) => {
  const [formData, setFormData] = useState({
    position: "",
    emailSubject: "",
    emailBody: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        position: editData.position || "",
        emailSubject: editData.emailSubject || "",
        emailBody: editData.emailBody || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const result = await apiRequest({
        url: `http://localhost:5000/api/position/editUserPositions/${editData._id}`,
        method: "PUT",
        body: formData,
        token,
      });

      if (result?.statusCode === 200) {
        toast.success(result.message || "Position updated");
        setShowModal(false);
        refreshList(); // to re-fetch templates
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
          ✏️ Edit Position
        </h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={formData.position}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-blue-200 text-black"
          />
          <input
            type="text"
            name="emailSubject"
            placeholder="Email Subject"
            value={formData.emailSubject}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-blue-200 text-black"
          />
          <textarea
            name="emailBody"
            placeholder="Email Body"
            value={formData.emailBody}
            onChange={handleChange}
            required
            className="p-3 rounded-md border border-blue-200 text-black"
          />
          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
