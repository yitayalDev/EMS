import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext';

const SalaryList = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get('salary');
    setItems(data);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white drop-shadow-lg">
          Salary
        </h2>

        {/* Add Salary Button: neon green pulse with white text */}
        {user?.role === 'admin' && (
          <Link
            to="/admin/salary/add"
            className="group px-6 py-3 text-sm font-semibold !text-white rounded-xl
                       bg-gradient-to-r from-green-500 to-green-700
                       border-2 border-green-400
                       shadow-[0_0_10px_#22c55e,0_0_20px_#16a34a,0_0_30px_#15803d]
                       hover:from-green-600 hover:to-green-800
                       hover:shadow-[0_0_15px_#22c55e,0_0_25px_#16a34a,0_0_35px_#15803d]
                       hover:scale-105
                       transition-all duration-200 ease-in-out
                       animate-neon-pulse"
          >
            Add Salary
          </Link>
        )}
      </div>

      {/* Glassmorphic Table Card */}
      <div className="relative rounded-2xl overflow-hidden p-1">
        {/* Neon border */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-lime-400 to-emerald-500 blur-xl opacity-70 animate-neon-border rounded-2xl"></div>

        {/* Table container */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-x-auto hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800/70 border-b border-purple-500">
              <tr>
                <th className="px-4 py-3 text-left">No.</th>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Net Salary</th>
                <th className="px-4 py-3 text-left">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s, i) => (
                <tr key={s._id} className="border-t border-purple-600 hover:bg-purple-700/30 hover:shadow-[0_0_15px_#22c55e] transition-all duration-200">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{s.employee?.name}</td>
                  <td className="px-4 py-3">{s.department?.name}</td>
                  <td className="px-4 py-3">{s.netSalary}</td>
                  <td className="px-4 py-3">{new Date(s.payDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-green-300">
                    No salary records.
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

export default SalaryList;
