import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api.js';

const EditDepartment = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/departments');
      const dept = data.find((d) => d._id === id);
      if (dept) setName(dept.name);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/departments/${id}`, { name });
    navigate('/admin/departments');
  };

  return (
    <div className="max-w-md bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Edit Department</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          type="submit"
          className="w-full border border-blue-500 bg-white text-blue-600 font-semibold py-2 rounded hover:bg-blue-50"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditDepartment;
