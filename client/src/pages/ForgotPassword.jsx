import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [gradientIndex, setGradientIndex] = useState(0); // for animated background
  const navigate = useNavigate();

  const gradients = [
    'from-purple-800 via-indigo-800 to-blue-900',
    'from-pink-700 via-red-700 to-yellow-600',
    'from-green-800 via-teal-700 to-cyan-700',
  ];

  // Animate background gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000); // change every 5s
    return () => clearInterval(interval);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMsg(data.message);

      if (data.token) {
        setTimeout(() => {
          navigate(`/reset-password/${data.token}`);
        }, 1500);
      }
    } catch (err) {
      setMsg(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-r ${gradients[gradientIndex]} transition-all duration-1000`}
    >
      <div className="bg-black/50 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">Forgot Password</h2>
        {msg && <p className="text-green-400 mb-4">{msg}</p>}

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-white border border-white/30 focus:border-purple-400 focus:ring focus:ring-purple-300/30 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-blue-400 bg-blue-500 shadow-lg border border-blue-300 transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-400/70 animate-pulse-button ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes pulse-button {
            0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 0 30px rgba(59, 130, 246, 0.5); }
          }
          .animate-pulse-button {
            animation: pulse-button 2s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default ForgotPassword;
