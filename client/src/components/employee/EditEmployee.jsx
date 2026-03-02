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
    role: 'employee',
    permissions: [],
  });

  const ROLES = [
    { value: 'admin', label: 'Admin' },
    { value: 'hr', label: 'HR Manager' },
    { value: 'finance', label: 'Finance/Payroll Officer' },
    { value: 'it_admin', label: 'IT Admin' },
    { value: 'employee', label: 'Employee' }
  ];

  const PERMISSIONS = [
    { value: 'manage_users', label: 'Manage Users' },
    { value: 'delete_records', label: 'Delete Records' },
    { value: 'view_salary', label: 'View Salary' },
    { value: 'manage_salary', label: 'Manage Salaries' },
    { value: 'manage_leaves', label: 'Manage Leaves' },
    { value: 'manage_assets', label: 'Manage Assets' },
    { value: 'manage_notices', label: 'Manage Notices' },
    { value: 'view_analytics', label: 'View Analytics' }
  ];

  const DEFAULT_MAP = {
    admin: ['manage_users', 'delete_records', 'view_salary', 'manage_salary', 'manage_leaves', 'manage_assets', 'manage_notices', 'view_analytics'],
    hr: ['manage_users', 'manage_leaves', 'manage_notices'],
    finance: ['view_salary', 'manage_salary'],
    it_admin: ['manage_assets', 'delete_records'],
    employee: []
  };

  const handlePermissionToggle = (perm) => {
    setForm(prev => {
      const perms = prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: perms };
    });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setForm({
      ...form,
      role: newRole,
      permissions: DEFAULT_MAP[newRole] || []
    });
  };

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

          <div className="col-span-full pt-4 border-t border-green-400/20">
            <h3 className="text-lg font-bold text-white mb-4">Advanced Permissions (RBAC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-300 mb-1">System Role</label>
                <select
                  value={form.role}
                  onChange={handleRoleChange}
                  className="w-full bg-green-900/40 border border-green-400/30 px-3 py-2 rounded text-white focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-1">Custom Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSIONS.map(perm => (
                    <label key={perm.value} className="flex items-center gap-2 p-1.5 rounded border border-green-400/10 hover:bg-green-800/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm.value)}
                        onChange={() => handlePermissionToggle(perm.value)}
                        className="w-4 h-4 rounded border-green-400/30 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs text-green-100">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
      </div>
    </div>
  );
};

export default EditEmployee;
