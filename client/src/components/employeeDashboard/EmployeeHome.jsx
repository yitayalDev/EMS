import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';
import SummaryCard from '../dashboard/SummaryCard.jsx';

const EmployeeHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalLeaves: 0, pendingLeaves: 0 });

  useEffect(() => {
    if (user?.employeeId) {
      api.get(`/dashboard/employee/${user.employeeId}`)
        .then(({ data }) => setStats(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div
      className="min-h-screen p-6
                 bg-gradient-to-br
                 from-green-300 via-lime-300 to-yellow-300"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard label="Total Leaves" value={stats.totalLeaves} />
        <SummaryCard label="Pending Leaves" value={stats.pendingLeaves} />
      </div>
    </div>
  );
};

export default EmployeeHome;
