import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, Globe, Bell, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  // Vibrant gradient colors for header
  const gradients = [
    'from-purple-900 via-indigo-900 to-pink-800',
    'from-pink-700 via-rose-600 to-orange-500',
    'from-blue-800 via-cyan-600 to-teal-500',
    'from-green-700 via-lime-500 to-yellow-400',
    'from-purple-800 via-fuchsia-700 to-pink-600',
  ];

  const { t, i18n } = useTranslation();
  const [gradientIndex, setGradientIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markRead = async () => {
    try {
      if (notifications.some(n => !n.isRead)) {
        await api.put('/notifications/mark-as-read');
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex(prev => (prev + 1) % gradients.length);
    }, 2000); // change every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className={`bg-gradient-to-r ${gradients[gradientIndex]} shadow-lg flex items-center justify-between px-6 py-3 transition-all duration-1000 overflow-hidden`}
    >
      {/* Large Marquee Welcome Text & Hamburger */}
      <div className="flex-1 overflow-hidden relative flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 mr-3 text-white focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        <span className="animate-marquee whitespace-nowrap text-white font-extrabold text-4xl drop-shadow-md">
          {t('navbar.welcome')} {user?.role === 'admin' ? 'Admin' : user?.name}
        </span>
      </div>

      <div className="flex items-center gap-4 ml-6 shrink-0 relative z-20">
        {user?.companyLogo && (
          <img
            src={`${API_BASE_URL}${user.companyLogo}`}
            alt="Logo"
            className="hidden sm:block w-10 h-10 rounded-full object-contain bg-white/20 p-1 border border-white/30"
          />
        )}

        <div className="text-right hidden sm:block">
          <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Logged in as</p>
          <p className="text-sm font-bold text-white">{user?.name}</p>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markRead();
            }}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white flex items-center justify-center relative shadow-lg shadow-black/20"
            aria-label="View Notifications"
          >
            <Bell size={20} className={notifications.some(n => !n.isRead) ? 'animate-bounce text-yellow-300' : 'text-white'} />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform origin-top-right transition-all duration-300 z-[60]">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-indigo-50/50 dark:bg-gray-800/50">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <Bell size={16} className="text-indigo-600" />
                  Notifications
                </h3>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recent Activity</span>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-4 border-b border-gray-50 dark:border-gray-800 transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-indigo-500' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {notif.type === 'success' ? <CheckCircle2 size={16} /> : <Bell size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight mb-1">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white flex items-center justify-center"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-indigo-200" />}
        </button>

        {/* Language Switcher */}
        <div className="relative group">
          <button
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white flex items-center justify-center"
            aria-label="Change Language"
          >
            <Globe size={20} className="text-cyan-200" />
            <span className="ml-1 text-xs font-semibold uppercase">{i18n.language.split('-')[0]}</span>
          </button>

          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 z-50">
            <button onClick={() => changeLanguage('en')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${i18n.language.startsWith('en') ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'}`}>English</button>
            <button onClick={() => changeLanguage('am')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${i18n.language.startsWith('am') ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'}`}>አማርኛ</button>
            <button onClick={() => changeLanguage('fr')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${i18n.language.startsWith('fr') ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'}`}>Français</button>
            <button onClick={() => changeLanguage('es')} className={`block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors ${i18n.language.startsWith('es') ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'}`}>Español</button>
          </div>
        </div>

        {/* Neon Logout Button */}
        <button
          onClick={logout}
          className="px-4 py-2 text-sm font-semibold text-white rounded-lg
                       bg-gradient-to-r from-red-500 to-red-600
                       border-2 border-red-400
                       shadow-[0_0_10px_#f87171,0_0_20px_#f87171,0_0_30px_#ef4444]
                       hover:from-red-600 hover:to-red-700
                       hover:scale-105
                       transition-all duration-200 ease-in-out"
        >
          {t('navbar.logout')}
        </button>
      </div>

      {/* Marquee animation CSS */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 15s linear infinite;
          }
        `}
      </style>
    </header>
  );
};

export default Navbar;
