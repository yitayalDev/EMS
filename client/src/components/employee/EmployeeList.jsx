import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const EmployeeList = ({ highlightId }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadEmployees = async () => {
    try {
      const { data } = await api.get("employees");
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
      setConfirmDeleteId(null);
      alert("Employee deleted successfully");
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert(err.response?.data?.message || "Failed to delete employee");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">Employees</h2>
        {(user?.role === 'admin' || user?.role === 'hr' || user?.permissions?.includes('manage_users')) && (
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

      <div className="relative rounded-2xl overflow-hidden p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-lime-400 to-emerald-500 blur-xl opacity-70 animate-neon-border rounded-2xl"></div>

        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-x-auto hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          {loading ? (
            <div className="p-6 text-center text-white">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="p-6 text-center text-green-300">No employees found.</div>
          ) : (
            <table className="min-w-full text-sm text-white">
              <thead className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800/70 border-b border-purple-500">
                <tr>
                  <th className="px-4 py-3 text-left">No.</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr
                    key={emp._id}
                    className={`border-t border-purple-600 hover:bg-purple-700/30 hover:shadow-[0_0_15px_#22c55e] transition-all duration-200
                                ${highlightId === emp._id ? "animate-pulse bg-purple-700/40" : ""}`}
                  >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">
                      {emp.image ? (
                        <img
                          src={`http://localhost:5000${emp.image}`}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/50 shadow-md"
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
                        className="text-xs text-yellow-300 px-2 py-1 rounded bg-white hover:bg-yellow-100 hover:text-yellow-600 transition-all duration-200 shadow-sm"
                      >
                        View
                      </Link>
                      {(user?.role === 'admin' || user?.role === 'hr' || user?.permissions?.includes('manage_users')) && (
                        <Link
                          to={`/admin/employees/${emp._id}/edit`}
                          className="text-xs text-pink-400 px-2 py-1 rounded bg-white hover:bg-pink-100 hover:text-pink-600 transition-all duration-200 shadow-sm"
                        >
                          Edit
                        </Link>
                      )}
                      {(user?.role === 'admin' || user?.role === 'it_admin' || user?.permissions?.includes('delete_records')) && (
                        <button
                          onClick={() => setConfirmDeleteId(emp._id)}
                          className="text-xs text-red-400 px-2 py-1 rounded bg-white hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
