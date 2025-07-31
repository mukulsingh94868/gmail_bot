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
      const result = await apiRequest({
        url: `position/editUserPositions/${editData._id}`,
        method: "PUT",
        body: formData,
      });

      if (result?.statusCode === 200) {
        toast.success(result.message || "Position updated");
        setShowModal(false);
        refreshList();
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      toast.error("Update error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center gap-2">
          ✏️ <span>Edit Position</span>
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              name="position"
              placeholder="e.g. React Developer"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
            <input
              type="text"
              name="emailSubject"
              placeholder="e.g. Application for React Role"
              value={formData.emailSubject}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
            <textarea
              name="emailBody"
              placeholder="Write email body..."
              rows={5}
              value={formData.emailBody}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
