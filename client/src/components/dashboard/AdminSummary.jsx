import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import SummaryCard from './SummaryCard.jsx';

const AdminSummary = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('dashboard/admin');
        setStats(data);
      } catch {
        // ignore
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard label="Total Employees" value={stats.totalEmployees} color="teal" />
      <SummaryCard label="Departments" value={stats.totalDepartments} color="purple" />
      <SummaryCard label="Pending Leaves" value={stats.pendingLeaves} color="orange" />
    </div>
  );
};

export default AdminSummary;
