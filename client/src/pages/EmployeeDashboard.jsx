// src/pages/EmployeeDashboard.jsx
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/employeeDashboard/Sidebar.jsx';
import Navbar from '../components/dashboard/Navbar.jsx';
import EmployeeHome from '../components/employeeDashboard/EmployeeHome.jsx';
import Profile from '../components/employeeDashboard/Profile.jsx';
import LeavePage from '../components/employeeDashboard/LeavePage.jsx';
import Salary from '../components/employeeDashboard/Salary.jsx';
import Setting from '../components/employeeDashboard/Setting.jsx';
import Attendance from '../components/employeeDashboard/Attendance.jsx';
import Timesheet from '../components/employeeDashboard/Timesheet.jsx';

const EmployeeDashboard = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 space-y-4">
          <Routes>
            <Route path="" element={<EmployeeHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="leaves" element={<LeavePage />} />
            <Route path="salary" element={<Salary />} /> {/* Salary page route */}
            <Route path="attendance" element={<Attendance />} />
            <Route path="timesheet" element={<Timesheet />} />
            <Route path="settings" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
