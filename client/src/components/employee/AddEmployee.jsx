import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    joinDate: '',
    departmentId: '',
    position: '',
    status: 'active',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('departments');
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const required = ['name', 'email', 'password', 'dob', 'joinDate', 'departmentId', 'position'];
    for (let field of required) {
      if (!form[field]) {
        setError(`Please fill the ${field.replace('Id', '')} field`);
        setLoading(false);
        return;
      }
    }
    if (!image) {
      setError('Please select a profile image');
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', image);

      await api.post('auth/create-employee', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/admin/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-200 backdrop-blur-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          <div className="p-8">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8 tracking-tight">
              Create New <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Employee</span>
            </h2>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Email Address</label>
                  <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Temporary Password</label>
                  <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className={inputClass} autoComplete="new-password" />
                </div>

                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Joining Date</label>
                  <input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Department</label>
                  <select name="departmentId" value={form.departmentId} onChange={handleChange} className={inputClass}>
                    <option value="">Select Department</option>
                    {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Position</label>
                  <input name="position" placeholder="Senior Developer" value={form.position} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Employment Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <label className={labelClass}>Profile Photo</label>
                <div className="flex items-center gap-6 mt-2">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-700/30">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0
                      file:text-sm file:font-bold file:bg-indigo-50 dark:file:bg-indigo-900/30
                      file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 transition-all" />
                    <p className="mt-2 text-xs text-gray-400 tracking-wide uppercase font-semibold">Recommended: Square image, max 2MB</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/employees')}
                  className="px-8 py-3.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Add Employee Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
