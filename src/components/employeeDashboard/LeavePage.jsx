import { useState } from 'react';
import LeaveRequest from './LeaveRequest.jsx';
import MyLeaves from './MyLeaves.jsx';

const LeavePage = () => {
  // Holds the leaves in state so we can update without remount
  const [leaves, setLeaves] = useState([]);

  // Called after a leave is submitted
  const handleSubmitted = (newLeave) => {
    // Add the new leave at the top
    setLeaves((prev) => [newLeave, ...prev]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <LeaveRequest onSubmitted={handleSubmitted} />
      <MyLeaves leaves={leaves} setLeaves={setLeaves} />
    </div>
  );
};

export default LeavePage;
