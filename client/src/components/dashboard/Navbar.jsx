import { useAuth } from '../../context/AuthContext.jsx';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();

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
      {/* Large Marquee Welcome Text */}
      <div className="flex-1 overflow-hidden relative">
        <span className="animate-marquee whitespace-nowrap text-white font-extrabold text-4xl drop-shadow-md">
          Welcome {user?.role === 'admin' ? 'Admin' : user?.name}
        </span>
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
                   transition-all duration-200 ease-in-out ml-4"
      >
        Logout
      </button>

      {/* Marquee animation CSS */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 12s linear infinite;
          }
        `}
      </style>
    </header>
  );
};

export default Navbar;
