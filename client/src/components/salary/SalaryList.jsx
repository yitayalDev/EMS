import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext';

const SalaryList = () => {
  const { can } = useAuth();
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
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white drop-shadow-sm">
          Salary
        </h2>

        {/* Add Salary Button: neon green pulse with white text */}
        {can('manage_salary') && (
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

      {/* Premium Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">

        {/* Table container */}
        <div className="overflow-x-auto hover:shadow-xl transition-all duration-300">
          <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
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
                <tr key={s._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200">
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{s.employee?.name}</td>
                  <td className="px-4 py-3">{s.department?.name}</td>
                  <td className="px-4 py-3 font-medium text-emerald-600 dark:text-emerald-400">${s.netSalary?.toLocaleString()}</td>
                  <td className="px-4 py-3">{new Date(s.payDate).toLocaleDateString()}</td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
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
