import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const linkClass =
  'block px-4 py-2 text-sm rounded text-white hover:bg-purple-700 transition-colors duration-200';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
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

  return (
    <>
      {/* Mobile Overlay Background */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-gradient-to-r ${gradients[gradientIndex]
          } transition-transform duration-300 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:block overflow-hidden shadow-2xl md:shadow-none`}
      >
        {/* Glassy sidebar content */}
        <div className="relative z-10 bg-black/40 backdrop-blur-md border-r border-white/20 h-full flex flex-col">
          <div className="p-4 border-b border-white/20 flex items-center justify-between">
            <h2 className="font-bold text-lg text-white">EMS Admin</h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-white/70 hover:text-white md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="p-4 space-y-1 flex-1">
            <NavLink
              to="/admin"
              end
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/employees"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              Employees
            </NavLink>
            <NavLink
              to="/admin/departments"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              Departments
            </NavLink>
            <NavLink
              to="/admin/leaves"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              Leaves
            </NavLink>
            <NavLink
              to="/admin/salary"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              Salary
            </NavLink>
            <NavLink
              to="/admin/settings"
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              Settings
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
