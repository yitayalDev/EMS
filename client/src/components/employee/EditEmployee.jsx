import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { API_BASE_URL } from '../../utils/api.js';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: '',
    dob: '',
    joinDate: '',
    departmentId: '',
    position: '',
    status: 'active',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [permForm, setPermForm] = useState({
    role: 'employee',
    permissions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, empRes] = await Promise.all([
          api.get('departments'),
          api.get(`employees/${id}`),
        ]);

        setDepartments(depRes.data);
        const e = empRes.data;

        setForm({
          name: e.name || '',
          dob: e.dob ? e.dob.substring(0, 10) : '',
          joinDate: e.joinDate ? e.joinDate.substring(0, 10) : '',
          departmentId: e.department?._id || '',
          position: e.position || '',
          status: e.status || 'active',
        });

        setPermForm({
          role: e.user?.role || 'employee',
          permissions: e.user?.permissions || [],
        });

        setPreview(e.image ? `${API_BASE_URL}${e.image}` : null);
      } catch (err) {
        console.error(err);
        alert('Failed to load employee data');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);

      await api.put(`employees/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Employee updated successfully');
      navigate('/admin/employees');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error');
    }
  };

  const handlePermSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`employees/${id}/permissions`, permForm);
      alert('Role and permissions updated successfully!');
    } catch (err) {
      console.error('Update Permission Error Full:', err);
      alert(`Error ${err.response?.status || 'Unknown'}: ${err.response?.data?.message || err.message}\nURL: ${err.config?.url}`);
    }
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const perms = new Set(permForm.permissions);
    if (e.target.checked) perms.add(value);
    else perms.delete(value);
    setPermForm({ ...permForm, permissions: Array.from(perms) });
  };

  return (
    <div className="min-h-screen p-6 flex justify-center items-start bg-gradient-to-br from-green-900 via-emerald-900 to-teal-800">
      <div className="relative max-w-xl w-full rounded-2xl p-8 bg-green-950/60 backdrop-blur-xl border border-green-400/40 shadow-[0_0_25px_rgba(34,197,94,0.6)]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Edit Employee</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white placeholder-green-200 focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
          <input
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white placeholder-green-200 focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="col-span-full bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full mx-auto col-span-full border-2 border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.8)]"
            />
          )}
          <button
            type="submit"
            className="col-span-full bg-green-900/40 border border-green-400/40 px-5 py-2 rounded font-semibold transition hover:bg-green-800/40 text-blue-400 hover:text-blue-300"
          >
            Update Employee Info
          </button>
        </form>

        <hr className="my-10 border-green-400/30" />

        <h2 className="text-2xl font-bold text-white mb-6 text-center">Manage Role & Permissions</h2>
        <form onSubmit={handlePermSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-200 mb-1">Role</label>
            <select
              value={permForm.role}
              onChange={(e) => setPermForm({ ...permForm, role: e.target.value })}
              className="w-full bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="it_admin">IT Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">Custom Permissions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white">
              {[
                { id: 'view_salary', label: 'View Salary' },
                { id: 'manage_salary', label: 'Manage Salary' },
                { id: 'delete_records', label: 'Delete Records' },
                { id: 'manage_users', label: 'Manage Users' },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-green-300">
                  <input
                    type="checkbox"
                    value={p.id}
                    checked={permForm.permissions.includes(p.id)}
                    onChange={handleCheckboxChange}
                    className="rounded border-green-400 text-green-600 focus:ring-green-400 bg-green-900/60"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600/60 border border-indigo-400/40 px-5 py-2 rounded font-semibold text-white transition hover:bg-indigo-700/60 shadow-[0_0_15px_rgba(129,140,248,0.4)]"
          >
            Update Role & Permissions
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
