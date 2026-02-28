import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const linkClass = ({ isActive }) =>
  `block px-4 py-2 text-sm rounded transition-all duration-300
   ${isActive
     ? 'bg-white/40 text-black font-semibold shadow-md'
     : 'hover:bg-white/30 hover:text-black text-gray-900'
   }`;

const Sidebar = () => {
  const gradients = [
    'from-green-300 via-green-400 to-green-500',
    'from-yellow-300 via-yellow-400 to-yellow-500',
    'from-lime-300 via-lime-400 to-lime-500',
    'from-emerald-300 via-emerald-400 to-emerald-500',
    'from-cyan-300 via-cyan-400 to-cyan-500',
  ];

  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className={`w-64 h-screen hidden md:block
                  bg-gradient-to-b ${gradients[gradientIndex]}
                  transition-all duration-1000`}
    >
      {/* Glass Header */}
      <div className="p-4 border-b border-white/40 backdrop-blur-xl bg-white/20">
        <h2 className="font-bold text-lg text-gray-900">Employee</h2>
      </div>

      {/* Glass Menu */}
      <nav className="p-4 space-y-2 backdrop-blur-xl bg-white/20 h-full">
        <NavLink to="/employee" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/employee/profile" className={linkClass}>
          My Profile
        </NavLink>
        <NavLink to="/employee/leaves" className={linkClass}>
          Leave
        </NavLink>
        <NavLink to="/employee/salary" className={linkClass}>
          Salary
        </NavLink>
        <NavLink to="/employee/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
