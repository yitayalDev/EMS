import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api.js';

const LeaveDetails = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('leaves');
      const item = data.find((x) => x._id === id);
      setLeave(item || null);
    };
    load();
  }, [id]);

  if (!leave) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded shadow p-4 max-w-md">
      <h2 className="text-lg font-semibold mb-3">Leave Details</h2>
      <p className="text-sm mb-1">
        Employee: <span className="font-medium">{leave.employee?.name}</span>
      </p>
      <p className="text-sm mb-1">Type: {leave.leaveType}</p>
      <p className="text-sm mb-1">Days: {leave.days}</p>
      <p className="text-sm mb-1">Status: {leave.status}</p>
      <p className="text-sm mb-1">Reason: {leave.reason}</p>
    </div>
  );
};

export default LeaveDetails;
