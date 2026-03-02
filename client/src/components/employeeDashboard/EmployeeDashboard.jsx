import { useState } from 'react';
import api from '../../utils/api.js';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getStrength = () => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { label: 'Medium', color: 'bg-yellow-500' };
    if (score >= 3) return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength();
  const isValid =
    newPassword &&
    confirmPassword &&
    newPassword === confirmPassword &&
    strength?.label !== 'Weak';

  const handleSubmit = async (e) => {
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
      setConfirmPassword('');
    } catch (err) {
      setType('error');
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Change Password
      </h2>

      {message && (
        <div
          className={`mb-4 text-sm rounded-lg px-4 py-2 border
            ${
              type === 'success'
                ? 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-300'
                : 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-300'
            }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrent ? 'text' : 'password'}
            placeholder="Current password"
            className="w-full input-style pr-12"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="eye-btn"
          >
            {showCurrent ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? 'text' : 'password'}
            placeholder="New password"
            className="w-full input-style pr-12"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="eye-btn"
          >
            {showNew ? <EyeSlashIcon /> : <EyeIcon />}
          </button>

          {/* Strength Meter */}
          {newPassword && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
                <div
                  className={`h-2 rounded ${strength.color}`}
                  style={{
                    width:
                      strength.label === 'Weak'
                        ? '33%'
                        : strength.label === 'Medium'
                        ? '66%'
                        : '100%',
                  }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                Strength: <span className="font-medium">{strength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            className="w-full input-style pr-12"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="eye-btn"
          >
            {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-2 text-sm font-semibold rounded-lg transition
            ${
              isValid
                ? 'bg-sky-600 hover:bg-sky-700 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default Setting;
