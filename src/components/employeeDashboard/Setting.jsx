import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Setting = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success'); // success | error
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.put('/settings/update-profile', { name, email });
      setType('success');
      setMessage(data.message);
      login(data.user, localStorage.getItem('ems_token')); // Refresh local user data
    } catch (err) {
      setType('error');
      setMessage(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data } = await api.post('/settings/change-password', {
        currentPassword,
        newPassword,
      });
      setType('success');
      setMessage(data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setType('error');
      setMessage(err.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div
        className="
          p-6 rounded-2xl shadow-2xl border
          bg-gradient-to-br from-indigo-50 via-sky-50 to-white/80
          dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/70
          backdrop-blur-xl
          border-gray-200 dark:border-gray-700
        "
      >
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          General Settings
        </h2>

        {message && (
          <div
            className={`mb-4 text-sm rounded-lg px-4 py-2 border
              ${type === 'success'
                ? 'text-green-700 bg-green-100/80 border-green-300 dark:bg-green-900/30 dark:text-green-300'
                : 'text-red-700 bg-red-100/80 border-red-300 dark:bg-red-900/30 dark:text-red-300'
              }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmitProfile} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-2 text-sm
                bg-white/80 dark:bg-gray-800/80
                border border-gray-300 dark:border-gray-600
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-2 text-sm
                bg-white/80 dark:bg-gray-800/80
                border border-gray-300 dark:border-gray-600
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl text-white font-semibold
              bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
          >
            Update Profile
          </button>
        </form>
      </div>

      <div
        className="
          p-6 rounded-2xl shadow-2xl border
          bg-gradient-to-br from-indigo-50 via-sky-50 to-white/80
          dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/70
          backdrop-blur-xl
          border-gray-200 dark:border-gray-700
        "
      >
        <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
          Security Settings
        </h2>

        <form onSubmit={handleSubmitPassword} className="space-y-5">
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-2 pr-14 text-sm
                bg-white/80 dark:bg-gray-800/80
                border border-gray-300 dark:border-gray-600
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-medium text-xs"
            >
              {showCurrent ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-2 pr-14 text-sm
                bg-white/80 dark:bg-gray-800/80
                border border-gray-300 dark:border-gray-600
                text-gray-800 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-medium text-xs"
            >
              {showNew ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl text-white font-semibold
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setting;
