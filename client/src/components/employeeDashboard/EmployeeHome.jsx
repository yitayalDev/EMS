import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import SummaryCard from '../dashboard/SummaryCard.jsx';
import NoticeBoard from '../dashboard/NoticeBoard.jsx';

const EmployeeHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalLeaves: 0, pendingLeaves: 0 });

  useEffect(() => {
    if (user?.employeeId) {
      api.get(`dashboard/employee/${user.employeeId}`)
        .then(({ data }) => setStats(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div
        className="p-6 rounded-xl shadow-sm border border-transparent grid grid-cols-1 md:grid-cols-2 gap-6
                   bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20"
      >
        <SummaryCard label="Total Leaves" value={stats.totalLeaves} />
        <SummaryCard label="Pending Leaves" value={stats.pendingLeaves} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notice Board */}
        <div className="h-[500px]">
          <NoticeBoard />
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
