import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';

const MyLeaves = ({ leaves, setLeaves }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch leaves ONLY once when page loads
  useEffect(() => {
    const fetchLeaves = async () => {
      if (!user?.employeeId) return;

      try {
        const { data } = await api.get('/leaves/my');
        setLeaves(data);
      } catch (err) {
        console.error('Failed to fetch leaves:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [user?.employeeId, setLeaves]);

  // ✅ Mark leave as seen
  const markSeen = async (leaveId) => {
    try {
      await api.put(`/leaves/${leaveId}/seen`);

      setLeaves((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, seen: true } : l
        )
      );
    } catch (err) {
      console.error('Failed to mark leave as seen:', err);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-black/40 p-4 rounded-2xl border-2 border-pink-400">
      <h2 className="text-pink-400 font-bold mb-3">My Leaves</h2>

      {leaves.length === 0 ? (
        <p className="text-gray-300 text-sm">No leave requests found.</p>
      ) : (
        <table className="w-full text-white text-sm">
          <thead>
            <tr className="bg-pink-800/40">
              <th className="p-2 text-left">No.</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l, i) => (
              <tr
                key={l._id}
                className="border-t border-pink-400/50 cursor-pointer hover:bg-pink-800/20 transition-colors"
                onClick={() => markSeen(l._id)}
              >
                <td className="p-2 flex items-center gap-2">
                  {i + 1}
                  {!l.seen && (
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse shadow-lg"></span>
                  )}
                </td>

                <td className="p-2">{l.leaveType}</td>

                <td
                  className={`p-2 font-bold ${
                    l.status === 'approved'
                      ? 'text-green-400'
                      : l.status === 'rejected'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }`}
                >
                  {l.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLeaves;
