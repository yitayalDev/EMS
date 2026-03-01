import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const linkClass =
  'block px-4 py-2 text-sm rounded text-white hover:bg-purple-700 transition-colors duration-200';

const AdminSidebar = () => {
  const { user } = useAuth();
  // Vibrant, attractive gradient colors
  const gradients = [
    'from-indigo-900 via-purple-800 to-pink-700',
    'from-red-600 via-orange-500 to-yellow-400',
    'from-green-700 via-teal-500 to-cyan-400',
    'from-blue-800 via-cyan-600 to-teal-400',
    'from-pink-700 via-fuchsia-600 to-purple-500',
    'from-orange-600 via-rose-500 to-pink-400',
    'from-purple-900 via-indigo-700 to-blue-500',
  ];

  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex(prev => (prev + 1) % gradients.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <aside
      className={`w-64 h-screen hidden md:block bg-gradient-to-r ${gradients[gradientIndex]} transition-all duration-1000 relative overflow-hidden`}
    >
      {/* Glassy sidebar content */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border border-white/20 h-full flex flex-col">
        <div className="p-4 border-b border-white/20">
          <h2 className="font-bold text-lg text-white">EMS Admin</h2>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin/employees" className={linkClass}>
              Employees
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin/departments" className={linkClass}>
              Departments
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin/leaves" className={linkClass}>
              Leaves
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin/salary" className={linkClass}>
              Salary
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin/attendance" className={linkClass}>
              Attendance
            </NavLink>
          )}

          <NavLink to="/admin/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
