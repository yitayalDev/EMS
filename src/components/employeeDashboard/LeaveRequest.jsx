import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';

const LeaveRequest = ({ onSubmitted }) => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    departmentId: '',
    leaveType: '',
    days: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const { data } = await api.get('departments');
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    loadDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };

    if ((name === 'fromDate' || name === 'toDate') && newForm.fromDate && newForm.toDate) {
      const start = new Date(newForm.fromDate);
      const end = new Date(newForm.toDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      newForm.days = diffDays > 0 ? diffDays : '';
    }
    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!user?.employeeId) return setMessage('User session not found.');

    try {
      const fd = new FormData();
      fd.append('employeeId', user.employeeId);
      if (form.departmentId) fd.append('departmentId', form.departmentId);
      fd.append('leaveType', form.leaveType);
      fd.append('days', Number(form.days));
      fd.append('fromDate', form.fromDate);
      fd.append('toDate', form.toDate);
      fd.append('reason', form.reason);
      if (file) fd.append('file', file);

      const { data } = await api.post('leaves', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Leave request submitted successfully!');
      setForm({ departmentId: '', leaveType: '', days: '', fromDate: '', toDate: '', reason: '' });
      setFile(null);

      // ✅ Pass the new leave to LeavePage so it appears immediately
      if (onSubmitted) onSubmitted(data.leave);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting leave');
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-lg p-6 rounded-2xl border-2 border-cyan-400 shadow-neon">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Request Leave</h2>

      {message && (
        <div className="mb-4 px-4 py-2 rounded text-sm text-white bg-cyan-600/30 border border-cyan-400/50">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
        <div>
          <label className="block mb-1 text-cyan-300">Department (Optional)</label>
          <select
            name="departmentId"
            className="border rounded px-3 py-2 w-full bg-black/50 border-cyan-400/30 focus:border-cyan-400 outline-none transition-all"
            value={form.departmentId}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-cyan-300">Leave Type</label>
          <input
            name="leaveType"
            placeholder="Annual, Sick, etc."
            className="border rounded px-3 py-2 w-full bg-black/50 border-cyan-400/30 focus:border-cyan-400 outline-none"
            value={form.leaveType}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-cyan-300">From Date</label>
          <input
            type="date"
            name="fromDate"
            className="border rounded px-3 py-2 w-full bg-black/50 border-cyan-400/30"
            value={form.fromDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-cyan-300">To Date</label>
          <input
            type="date"
            name="toDate"
            className="border rounded px-3 py-2 w-full bg-black/50 border-cyan-400/30"
            value={form.toDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-cyan-300">Total Days</label>
          <input
            type="number"
            name="days"
            readOnly
            placeholder="Auto-calculated"
            className="border rounded px-3 py-2 w-full bg-black/30 border-gray-700 text-cyan-200 font-bold"
            value={form.days}
          />
        </div>

        <div>
          <label className="block mb-1 text-cyan-300">Attachment (Optional)</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-cyan-500 file:text-black hover:file:bg-cyan-600 cursor-pointer"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 text-cyan-300">Reason for Leave</label>
          <textarea
            name="reason"
            rows={3}
            className="border rounded px-3 py-2 w-full bg-black/50 border-cyan-400/30"
            value={form.reason}
            onChange={handleChange}
            required
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 transition-all rounded text-black font-bold uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequest;
