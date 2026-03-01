import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSidebar } from '../../context/SidebarContext.jsx';
import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, ShieldCheck } from 'lucide-react';

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

  const [gradientIndex, setGradientIndex] = useState(0);

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
          Welcome {user?.role === 'admin' ? 'Admin' : user?.name}
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

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white flex items-center justify-center"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-300" /> : <Moon size={20} className="text-indigo-200" />}
        </button>

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
          Logout
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
