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
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white drop-shadow-md">
          Departments
        </h2>

        {/* Add Department Button (Green Neon) with White Text */}
        {user?.role === 'admin' && (
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

      {/* Premium Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto hover:shadow-xl transition-all duration-300">
          {loading ? (
            <p className="p-3 text-gray-500 dark:text-gray-400 text-center">Loading departments...</p>
          ) : error ? (
            <p className="p-3 text-red-500 dark:text-red-400 text-center">{error}</p>
          ) : (
            <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
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
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      <td className="px-3 py-2">{i + 1}</td>
                      <td className="px-3 py-2">{d.name}</td>
                      <td className="px-3 py-2 space-x-2">
                        {user?.role === 'admin' && (
                          <Link
                            to={`/admin/departments/${d._id}/edit`}
                            className="text-xs text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-md bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors shadow-sm"
                          >
                            Edit
                          </Link>
                        )}

                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="text-xs text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm"
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
                      className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
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
