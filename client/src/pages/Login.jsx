import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gradientIndex, setGradientIndex] = useState(0);

  const navigate = useNavigate();
  const { login } = useAuth();

  const gradients = [
    'from-purple-800 via-indigo-800 to-blue-900',
    'from-pink-700 via-red-700 to-yellow-600',
    'from-green-800 via-teal-700 to-cyan-700',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (data.user.role === 'employee') {
        navigate('/employee/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-64 py-16
      bg-gradient-to-r ${gradients[gradientIndex]} transition-all duration-1000`}
    >
      <div className="bg-black/50 p-16 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          EMS Login
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/20 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full p-3 rounded bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:ring focus:ring-purple-300/30 outline-none"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-white text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:ring focus:ring-purple-300/30 outline-none"
              disabled={isLoading}
            />
          </div>

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded text-blue-400 bg-blue-500 shadow-lg border border-blue-300 transition-all duration-300 hover:bg-blue-600 animate-pulse-button ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* FORGOT PASSWORD */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="relative text-sm font-medium text-blue-400 hover:text-blue-300
                         after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                         after:w-0 after:bg-blue-400 after:transition-all after:duration-300
                         hover:after:w-full"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      <style>
        {`
          @keyframes pulse-button {
            0%, 100% {
              box-shadow: 0 0 10px rgba(59,130,246,0.5),
                          0 0 20px rgba(59,130,246,0.3);
            }
            50% {
              box-shadow: 0 0 20px rgba(59,130,246,0.7),
                          0 0 30px rgba(59,130,246,0.5);
            }
          }
          .animate-pulse-button {
            animation: pulse-button 2s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default Login;
