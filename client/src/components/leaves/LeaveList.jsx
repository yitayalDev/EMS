import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [toast, setToast] = useState(null);

  // ----------------------------
  // Toast notification
  // ----------------------------
  function showToast(message, type = 'info') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ----------------------------
  // Fetch leaves
  // ----------------------------
  const load = async () => {
    try {
      const { data } = await api.get('leaves');
      setLeaves(data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load leaves', 'error');
    }
  };

  useEffect(() => {
    (async () => await load())();
  }, []);

  // ----------------------------
  // Update leave status with confirmation
  // ----------------------------
  const updateStatus = async (id, status) => {
    const confirmMsg =
      status === 'approved'
        ? 'Are you sure you want to approve this leave?'
        : 'Are you sure you want to reject this leave?';
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.put(`/leaves/${id}/status`, { status });
      setLeaves((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      ); // update locally for immediate feedback
      showToast(`Leave ${status}`, status === 'approved' ? 'success' : 'error');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status', 'error');
    }
  };

  // ----------------------------
  // Delete leave permanently
  // ----------------------------
  const deleteLeave = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this leave?')) return;

    try {
      setDeletingIds((prev) => [...prev, id]); // start animation
      setLeaves((prev) => prev.filter((l) => l._id !== id)); // remove from table immediately

      await api.delete(`/leaves/${id}`); // delete in backend
      showToast('Leave permanently deleted', 'info');
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    } catch (err) {
      console.error(err);
      showToast('Failed to delete leave', 'error');
    }
  };

  // ----------------------------
  // Status badge
  // ----------------------------
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
            {status}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            {status}
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {status}
          </span>
        );
    }
  };

  // ----------------------------
  // Pill button
  // ----------------------------
  const ActionButton = ({ children, color, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-full ${color} hover:opacity-90 transition`}
    >
      {children}
    </button>
  );

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="p-6 min-h-screen relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg text-white font-medium transform transition-all duration-300
            ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}
            ${toast ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-900">Leaves</h2>
      </div>

      <div className="bg-white/90 rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-blue-800">No.</th>
              <th className="px-4 py-2 text-left font-medium text-blue-800">Emp</th>
              <th className="px-4 py-2 text-left font-medium text-blue-800">Type</th>
              <th className="px-4 py-2 text-left font-medium text-blue-800">Days</th>
              <th className="px-4 py-2 text-left font-medium text-blue-800">Status</th>
              <th className="px-4 py-2 text-left font-medium text-blue-800">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {leaves.map((l, i) => (
              <tr
                key={l._id}
                className={`border-t transition-all duration-300 ease-in-out ${deletingIds.includes(l._id) ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{l.employee?.name}</td>
                <td className="px-4 py-2">{l.leaveType}</td>
                <td className="px-4 py-2">{l.days}</td>
                <td className="px-4 py-2">{getStatusBadge(l.status)}</td>
                <td className="px-4 py-2 flex flex-wrap gap-2">
                  <ActionButton color="bg-sky-100 text-sky-700">
                    <Link to={`/admin/leaves/${l._id}`}>View</Link>
                  </ActionButton>

                  {l.status === 'pending' && (
                    <>
                      <ActionButton
                        color="bg-emerald-100 text-emerald-700"
                        onClick={() => updateStatus(l._id, 'approved')}
                      >
                        Approve
                      </ActionButton>
                      <ActionButton
                        color="bg-red-100 text-red-700"
                        onClick={() => updateStatus(l._id, 'rejected')}
                      >
                        Reject
                      </ActionButton>
                    </>
                  )}

                  <ActionButton
                    color="bg-gray-200 text-gray-800"
                    onClick={() => deleteLeave(l._id)}
                  >
                    Delete
                  </ActionButton>
                </td>
              </tr>
            ))}

            {!leaves.length && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No leave requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveList;
