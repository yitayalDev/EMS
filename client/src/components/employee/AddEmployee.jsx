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

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get('/departments');
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
        alert('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = [
      'name',
      'email',
      'password',
      'dob',
      'joinDate',
      'departmentId',
      'position',
    ];
    for (let field of required) {
      if (!form[field]) return alert(`Please fill the ${field} field`);
    }
    if (!image) return alert('Please select a profile image');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('image', image);

      await api.post('/auth/create-employee', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Employee created successfully!');
      navigate('/admin/employees');
    } catch (err) {
      console.error('Add Employee error:', err);
      alert(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            name="password"
            placeholder="Temporary Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
            autoComplete="current-password"
          />
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
          <input
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border px-3 py-2 rounded col-span-full"
            required
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full mx-auto col-span-full"
            />
          )}

          {/* Blue text button (as requested earlier) */}
          <button
            type="submit"
            className="col-span-full bg-green-600 hover:bg-green-700 text-blue-600 px-5 py-2 rounded font-semibold"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
