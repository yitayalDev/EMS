import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { LayoutDashboard, User, Calendar, DollarSign, Clock, FileText, Settings, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-300 ${isActive ? 'bg-white/40 text-gray-900 font-bold shadow-md' : 'text-gray-900 hover:bg-white/20'}`;

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isOpen, closeSidebar } = useSidebar();
  const gradients = [
    'from-green-300 via-green-400 to-green-500',
    'from-yellow-300 via-yellow-400 to-yellow-500',
    'from-lime-300 via-lime-400 to-lime-500',
    'from-emerald-300 via-emerald-400 to-emerald-500',
    'from-cyan-300 via-cyan-400 to-cyan-500',
  ];

  const [gradientIndex, setGradientIndex] = useState(0);

  const adminPermissions = ['manage_users', 'manage_departments', 'view_salary', 'manage_salary', 'manage_leaves', 'manage_assets', 'manage_notices', 'view_analytics'];
  const hasAnyAdminPermission = user?.permissions?.some(p => adminPermissions.includes(p));

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 h-screen transform transition-transform duration-300 ease-in-out bg-gradient-to-b ${gradients[gradientIndex]} overflow-y-auto shadow-2xl md:shadow-none
                   ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Glass Header */}
        <div className="p-4 border-b border-white/40 backdrop-blur-xl bg-white/20 flex items-center gap-3">
          {user?.companyLogo ? (
            <img
              src={`${API_BASE_URL}${user.companyLogo}`}
              alt="Org Logo"
              className="w-10 h-10 rounded-lg object-contain bg-white/30 p-1"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/30 flex items-center justify-center">
              <ShieldCheck className="text-gray-900" size={24} />
            </div>
          )}
          <div className="flex flex-col truncate">
            <h2 className="font-bold text-lg text-gray-900 truncate">
              {user?.companyName || 'EMS Pro'}
            </h2>
            {user?.isDemo && (
              <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold w-fit animate-pulse">
                DEMO MODE
              </span>
            )}
          </div>

        </div>

        {/* Glass Menu */}
        <nav className="p-4 space-y-2 backdrop-blur-xl bg-white/20 h-full">
          <NavLink to="/employee" end className={linkClass}>
            <LayoutDashboard size={18} />
            <span>{t('sidebar.dashboard')}</span>
          </NavLink>

          {hasAnyAdminPermission && (
            <NavLink to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-300 bg-indigo-600/20 text-indigo-900 font-bold border border-indigo-600/30 hover:bg-indigo-600/30">
              <ShieldCheck size={18} className="text-indigo-700" />
              <span>Management Portal</span>
            </NavLink>
          )}

          <NavLink to="/employee/profile" className={linkClass}>
            <User size={18} />
            <span>{t('sidebar.profile')}</span>
          </NavLink>
          <NavLink to="/employee/leaves" className={linkClass}>
            <Calendar size={18} />
            <span>{t('sidebar.leave')}</span>
          </NavLink>
          <NavLink to="/employee/salary" className={linkClass}>
            <DollarSign size={18} />
            <span>{t('sidebar.salary')}</span>
          </NavLink>
          <NavLink to="/employee/attendance" className={linkClass}>
            <Clock size={18} />
            <span>{t('sidebar.attendance')}</span>
          </NavLink>
          <NavLink to="/employee/timesheet" className={linkClass}>
            <FileText size={18} />
            <span>{t('sidebar.timesheet')}</span>
          </NavLink>
          <NavLink to="/employee/settings" className={linkClass}>
            <Settings size={18} />
            <span>{t('sidebar.settings')}</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
