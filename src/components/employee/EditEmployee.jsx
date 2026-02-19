import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api.js';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, empRes] = await Promise.all([
          api.get('/departments'),
          api.get(`/employees/${id}`),
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

        setPreview(e.image ? `http://localhost:5000${e.image}` : null);
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

      await api.put(`/employees/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Employee updated');
      navigate('/admin/employees');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Server error');
    }
  };

  return (
    {/* PAGE BACKGROUND */}
    <div className="min-h-screen p-6 flex justify-center items-start
                    bg-gradient-to-br from-green-900 via-emerald-900 to-teal-800">

      {/* CARD */}
      <div
        className="relative max-w-xl w-full rounded-2xl p-8
                   bg-green-950/60 backdrop-blur-xl
                   border border-green-400/40
                   shadow-[0_0_25px_rgba(34,197,94,0.6)]"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Edit Employee
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* INPUTS */}
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white placeholder-green-200
                       focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white
                       focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />

          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white
                       focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />

          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            required
            className="bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white
                       focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
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
            className="bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white placeholder-green-200
                       focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white
                       focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="col-span-full bg-green-900/40 border border-green-400/30
                       px-3 py-2 rounded text-white"
          />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 rounded-full mx-auto col-span-full
                         border-2 border-green-400
                         shadow-[0_0_12px_rgba(34,197,94,0.8)]"
            />
          )}

          {/* UPDATE BUTTON */}
          <button
            type="submit"
            className="col-span-full bg-green-900/40 border border-green-400/40
                       px-5 py-2 rounded font-semibold transition
                       hover:bg-green-800/40"
          >
            <span className="text-blue-400 hover:text-blue-300">
              Update Employee
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
