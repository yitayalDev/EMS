import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';

const AddDepartment = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Department name is required');
      return;
    }

    try {
      await api.post('/departments', { name: name.trim() });
      alert('Department added successfully!');
      navigate('/admin/departments');
    } catch (err) {
      console.error('AddDepartment Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to add department');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex items-center justify-center p-6">

      {/* Glassmorphic Form Container */}
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-white drop-shadow-md text-center">
          Add Department
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="w-full border rounded px-3 py-2 text-sm text-white bg-white/20 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Save Button with Neon Green */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-semibold rounded-lg
                       bg-gradient-to-r from-green-500 to-green-700
                       text-white
                       border-2 border-green-400
                       shadow-[0_0_10px_#22c55e,0_0_20px_#16a34a,0_0_30px_#15803d]
                       hover:from-green-600 hover:to-green-800
                       hover:scale-105
                       transition-all duration-200 ease-in-out
                       animate-neon-pulse"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
