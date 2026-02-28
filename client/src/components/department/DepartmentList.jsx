import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext';

const DepartmentList = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('ems_token');
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }

      const { data } = await api.get('departments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to view departments.');
      } else {
        setError('Failed to load departments.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Delete department
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;

    try {
      const token = localStorage.getItem('ems_token');
      if (!token) {
        alert('You are not logged in.');
        return;
      }

      await api.delete(`departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDepartments(); // refresh after delete
    } catch (err) {
      console.error('Error deleting department:', err);
      if (err.response?.status === 403) {
        alert('You do not have permission to delete this department.');
      } else {
        alert('Failed to delete department.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white drop-shadow-md">
          Departments
        </h2>

        {/* Add Department Button (Green Neon) with White Text */}
        {(user?.role === 'admin' || user?.role === 'hr') && (
          <Link
            to="/admin/departments/add"
            className="px-4 py-2 text-sm font-semibold rounded-lg
                       bg-gradient-to-r from-green-500 to-green-700
                       border-2 border-green-400
                       shadow-[0_0_10px_#22c55e,0_0_20px_#16a34a,0_0_30px_#15803d]
                       hover:from-green-600 hover:to-green-800
                       hover:scale-105
                       transition-all duration-100 ease-in-out
                       animate-neon-pulse"
          >
            <span className="text-white">Add Department</span>
          </Link>
        )}
      </div>

      {/* Neon Glassmorphic Table Card */}
      <div className="relative rounded-2xl overflow-hidden p-1">
        {/* Animated Neon Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-lime-400 to-emerald-500 blur-xl opacity-70 animate-neon-border rounded-2xl"></div>

        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-x-auto hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          {loading ? (
            <p className="p-3 text-green-300">Loading departments...</p>
          ) : error ? (
            <p className="p-3 text-red-400">{error}</p>
          ) : (
            <table className="min-w-full text-sm text-white">
              <thead className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800/70 border-b border-purple-500">
                <tr>
                  <th className="px-3 py-2 text-left">No.</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((d, i) => (
                    <tr
                      key={d._id}
                      className="border-t border-purple-600 hover:bg-purple-700/30 hover:shadow-[0_0_15px_#22c55e] transition-all duration-200"
                    >
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{d.name}</td>
                      <td className="px-3 py-2 space-x-2">
                        {(user?.role === 'admin' || user?.role === 'hr') && (
                          <Link
                            to={`/admin/departments/${d._id}/edit`}
                            className="text-xs text-amber-700 bg-white px-2 py-1 rounded
                                       hover:text-white hover:shadow-[0_0_8px_#ffbf00]
                                       transition-all duration-200
                                       animate-neon-pulse"
                          >
                            Edit
                          </Link>
                        )}

                        {(user?.role === 'admin' || user?.role === 'hr' || user?.permissions?.includes('delete_records')) && (
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="text-xs text-red-500 bg-white px-2 py-1 rounded
                                       hover:text-white hover:shadow-[0_0_8px_#f87171]
                                       transition-all duration-200
                                       animate-neon-pulse"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-3 text-center text-green-300"
                    >
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;
