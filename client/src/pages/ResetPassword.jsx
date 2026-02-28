import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [gradientIndex, setGradientIndex] = useState(0); // animated gradient

  const gradients = [
    'from-purple-800 via-indigo-800 to-blue-900',
    'from-pink-700 via-red-700 to-yellow-600',
    'from-green-800 via-teal-700 to-cyan-700',
  ];

  // Animate background gradient subtly
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-400 text-lg text-center">Invalid reset token.</p>
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (password !== confirmPassword) return setError('Passwords do not match.');

    try {
      setLoading(true);
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setMsg(data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-r ${gradients[gradientIndex]} transition-all duration-1000`}
    >
      <div className="bg-black/50 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl text-white font-bold mb-4 text-center">Reset Password</h2>
        {error && <p className="text-red-400 mb-3 text-center">{error}</p>}
        {msg && <p className="text-green-400 mb-3 text-center">{msg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-white border border-white/30 focus:border-purple-400 focus:ring focus:ring-purple-300/30 outline-none transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded bg-white/20 text-white placeholder-white border border-white/30 focus:border-purple-400 focus:ring focus:ring-purple-300/30 outline-none transition"
          />
          <button
            disabled={loading}
            className={`w-full py-3 rounded text-blue-400 bg-blue-500 shadow-lg border border-blue-300 transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-400/70 animate-pulse-button ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>

      {/* Tailwind custom animation for button glow */}
      <style>
        {`
          @keyframes pulse-button {
            0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.3); }
            50% { box-shadow: 0 0 20px rgba(59,130,246,0.7), 0 0 30px rgba(59,130,246,0.5); }
          }
          .animate-pulse-button {
            animation: pulse-button 2s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default ResetPassword;
