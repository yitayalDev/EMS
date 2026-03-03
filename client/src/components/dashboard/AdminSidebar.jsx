import { useAuth } from '../../context/AuthContext.jsx';
import { useSidebar } from '../../context/SidebarContext';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Building, Calendar, DollarSign, Clock, CreditCard, Settings, ShieldCheck, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 text-sm rounded-xl transition-all duration-300 ${isActive ? 'bg-white/30 text-white shadow-lg backdrop-blur-md font-semibold' : 'text-indigo-100 hover:bg-white/10'}`;

const AdminSidebar = () => {
  const { t } = useTranslation();
  const { user, can } = useAuth();
  const { isOpen, closeSidebar } = useSidebar();
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

  const canViewAnalytics = can('view_analytics');
  const canViewEmployees = can('manage_users');
  const canViewDepartments = can('manage_departments');
  const canViewLeaves = can('manage_leaves');
  const canViewSalary = can('view_salary') || can('manage_salary');
  const canViewAttendance = can('manage_attendance');

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
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 h-screen transform transition-transform duration-300 ease-in-out bg-gradient-to-r ${gradients[gradientIndex]} overflow-y-auto shadow-2xl md:shadow-none
                   ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Glassy sidebar content */}
        <div className="relative z-10 bg-black/40 backdrop-blur-md border border-white/20 h-full flex flex-col">
          <div className="p-4 border-b border-white/20 flex items-center gap-3">
            {user?.companyLogo ? (
              <img
                src={`${API_BASE_URL}${user.companyLogo}`}
                alt="Org Logo"
                className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <ShieldCheck className="text-white" size={24} />
              </div>
            )}
            <div className="flex flex-col truncate">
              <h2 className="font-bold text-lg text-white truncate">
                {user?.companyName || 'EMS Pro'}
              </h2>
              {user?.isDemo && (
                <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold w-fit animate-pulse">
                  DEMO MODE
                </span>
              )}
            </div>

          </div>
          <nav className="p-4 space-y-1 flex-1">
            <NavLink to="/admin" end className={linkClass}>
              <LayoutDashboard size={18} />
              <span>{t('sidebar.dashboard')}</span>
            </NavLink>

            {canViewAnalytics && (
              <NavLink to="/admin/analytics" className={linkClass}>
                <Clock size={18} />
                <span>Analytics</span>
              </NavLink>
            )}

            {canViewEmployees && (
              <NavLink to="/admin/employees" className={linkClass}>
                <Users size={18} />
                <span>{t('sidebar.employees')}</span>
              </NavLink>
            )}

            {canViewDepartments && (
              <NavLink to="/admin/departments" className={linkClass}>
                <Building size={18} />
                <span>{t('sidebar.departments')}</span>
              </NavLink>
            )}

            <NavLink to="/admin/assets" className={linkClass}>
              <Package size={18} />
              <span>Assets</span>
            </NavLink>

            {canViewLeaves && (
              <NavLink to="/admin/leaves" className={linkClass}>
                <Calendar size={18} />
                <span>{t('sidebar.leave')}</span>
              </NavLink>
            )}

            {canViewSalary && (
              <NavLink to="/admin/salary" className={linkClass}>
                <DollarSign size={18} />
                <span>{t('sidebar.salary')}</span>
              </NavLink>
            )}

            {canViewAttendance && (
              <NavLink to="/admin/attendance" className={linkClass}>
                <Clock size={18} />
                <span>{t('sidebar.attendance')}</span>
              </NavLink>
            )}

            {(user?.role === 'admin' || user?.role === 'finance') && (
              <NavLink to="/admin/billing" className={linkClass}>
                <CreditCard size={18} />
                <span>{t('sidebar.billing')}</span>
              </NavLink>
            )}

            <NavLink to="/admin/company-settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-white/30 text-white shadow-lg backdrop-blur-md' : 'text-indigo-100 hover:bg-white/10'}`}>
              <Settings size={18} />
              <span>Company Profile</span>
            </NavLink>

            <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-white/30 text-white shadow-lg backdrop-blur-md' : 'text-indigo-100 hover:bg-white/10'}`}>
              <ShieldCheck size={18} />
              <span>{t('sidebar.settings')}</span>
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
