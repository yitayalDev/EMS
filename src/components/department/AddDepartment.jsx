import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';

const AddDepartment = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name.trim()) {
      setError('Department name is required');
      setLoading(false);
      return;
    }

    try {
      await api.post('/departments', { name: name.trim() });
      navigate('/admin/departments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 tracking-tight text-center">
              Add New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Department</span>
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/departments')}
                  className="flex-1 px-8 py-3.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
