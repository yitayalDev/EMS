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
    <div className="p-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg text-white font-medium transform transition-all duration-300 z-50
            ${toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-indigo-600'}
            ${toast ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white drop-shadow-sm">Leaves</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto hover:shadow-xl transition-all duration-300">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">No.</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Emp</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Days</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, i) => (
                <tr
                  key={l._id}
                  className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out ${deletingIds.includes(l._id) ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
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
                      color="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      onClick={() => deleteLeave(l._id)}
                    >
                      Delete
                    </ActionButton>
                  </td>
                </tr>
              ))}

              {!leaves.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No leave requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveList;
