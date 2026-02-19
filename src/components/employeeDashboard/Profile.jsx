import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';

const Profile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌈 Background gradients (ONLY change)
  const gradients = [
    'from-green-300 via-green-400 to-green-500',
    'from-yellow-300 via-yellow-400 to-yellow-500',
    'from-lime-300 via-lime-400 to-lime-500',
    'from-emerald-300 via-emerald-400 to-emerald-500',
    'from-cyan-300 via-cyan-400 to-cyan-500',
  ];
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user?.employeeId) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/employees');
        const emp = data.find((e) => e._id === user.employeeId);
        setEmployee(emp || null);
      } catch {
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading)
    return <div className="text-center mt-20 text-gray-500 dark:text-gray-400">Loading...</div>;
  if (!employee)
    return <div className="text-center mt-20 text-gray-500 dark:text-gray-400">No profile data found.</div>;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 relative
                  bg-gradient-to-br ${gradients[gradientIndex]}
                  transition-all duration-1000`}
    >
      {/* Profile Card (UNCHANGED) */}
      <div className="max-w-xl w-full rounded-3xl backdrop-blur-xl border border-white/30 dark:border-gray-700 shadow-2xl p-8 relative z-10 transform transition-transform duration-300 hover:scale-105">

        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-green-500 opacity-50 animate-spin-slow"></div>

            {employee.image && (
              <img
                src={`http://localhost:5000${employee.image}`}
                alt={employee.name}
                className="w-32 h-32 rounded-full object-cover border-2 border-green-600 shadow-md relative z-10"
              />
            )}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
            {employee.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {employee.position || 'Employee'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Department</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {employee.department?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium capitalize text-gray-800 dark:text-gray-100">
              {employee.status}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Date of Birth</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {employee.dob ? new Date(employee.dob).toLocaleDateString() : '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Join Date</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
