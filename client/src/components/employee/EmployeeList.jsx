import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import api, { API_BASE_URL } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { TableSkeleton } from "../common/SkeletonLoader.jsx";
import { motion } from "framer-motion";

const EmployeeList = ({ highlightId }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`employees?page=${page}&limit=${limit}`);
      setEmployees(data.employees);
      setTotalPages(data.pages);
    } catch (err) {
      console.error("Failed to load employees:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      loadEmployees(); // Reload current page
      setConfirmDeleteId(null);
      alert("Employee deleted successfully");
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert(err.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white drop-shadow-sm">Employees</h2>
        {user?.role === 'admin' && (
          <Link
            to="/admin/employees/add"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl
                       bg-gradient-to-r from-green-500 to-green-700
                       border-2 border-green-400
                       shadow-[0_0_10px_#22c55e,0_0_20px_#16a34a,0_0_30px_#15803d]
                       hover:from-green-600 hover:to-green-800
                       hover:shadow-[0_0_15px_#22c55e,0_0_25px_#16a34a,0_0_35px_#15803d]
                       hover:scale-105
                       transition-all duration-200 ease-in-out
                       animate-neon-pulse"
          >
            <PlusIcon className="w-5 h-5 transform group-hover:rotate-12 group-hover:scale-125 transition-all duration-200" />
            Add Employee
          </Link>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200"
      >
        <div className="overflow-x-auto hover:shadow-xl transition-all duration-300">
          {loading ? (
            <TableSkeleton rows={limit} />
          ) : employees.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">No employees found.</div>
          ) : (
            <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">No.</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <motion.tbody
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                }}
              >
                {employees.map((emp, i) => (
                  <motion.tr
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    key={emp._id}
                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200
                                ${highlightId === emp._id ? "animate-pulse bg-green-50 dark:bg-green-900/30" : ""}`}
                  >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">
                      {emp.image ? (
                        <img
                          src={`${API_BASE_URL.replace(/\/$/, '')}/${emp.image.replace(/^\//, '')}`}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{emp.name}</td>
                    <td className="px-4 py-3">{emp.department?.name || "-"}</td>
                    <td className="px-4 py-3 space-x-2">
                      <Link
                        to={`/admin/employees/${emp._id}`}
                        className="text-xs text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
                      >
                        View
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to={`/admin/employees/${emp._id}/edit`}
                          className="text-xs text-green-600 dark:text-green-400 px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors shadow-sm"
                        >
                          Edit
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => setConfirmDeleteId(emp._id)}
                          className="text-xs text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors shadow-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-600">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page <span className="font-semibold text-gray-800 dark:text-white">{page}</span> of <span className="font-semibold text-gray-800 dark:text-white">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm text-center border-2 border-red-500 shadow-[0_0_20px_#f87171] animate-neon-pulse">
            <h2 className="text-lg font-bold text-red-400 mb-4">Confirm Delete</h2>
            <p className="text-white mb-6">Are you sure you want to delete this employee?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-[0_0_10px_#f87171]"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 shadow-[0_0_10px_#999]"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
