import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import SummaryCard from './SummaryCard.jsx';
import NoticeBoard from './NoticeBoard.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const AdminSummary = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
  });

  const [deptData, setDeptData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, deptRes] = await Promise.all([
          api.get('dashboard/admin'),
          api.get('dashboard/analytics/departments')
        ]);
        setStats(summaryRes.data);
        setDeptData(deptRes.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors duration-200">
        <SummaryCard label="Total Employees" value={stats.totalEmployees} color="teal" />
        <SummaryCard label="Departments" value={stats.totalDepartments} color="purple" />
        <SummaryCard label="Pending Leaves" value={stats.pendingLeaves} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notice Board */}
        <div className="h-[500px]">
          <NoticeBoard />
        </div>

        {/* Department Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-[500px]">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Employee Distribution</h2>
          <div className="flex-1 min-h-0">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="employees" name="Employees" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="leaves" name="Leaves Taken" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 text-sm">No department data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
