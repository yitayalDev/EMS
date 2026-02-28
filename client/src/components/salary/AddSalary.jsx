import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';

const AddSalary = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    employeeId: '',
    departmentId: '',
    basic: '',
    allowance: '',
    deductions: '',
    payDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, depRes] = await Promise.all([
          api.get('employees'),
          api.get('departments'),
        ]);
        setEmployees(empRes.data);
        setDepartments(depRes.data);
      } catch (err) {
        console.error('Failed to load employees or departments:', err.response?.data || err.message);
      }
    };
    load();
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.employeeId || !form.departmentId) {
        alert('Please select both employee and department.');
        return;
      }

      const payload = {
        employeeId: form.employeeId,
        departmentId: form.departmentId,
        basic: parseFloat(form.basic) || 0,
        allowance: parseFloat(form.allowance) || 0,
        deductions: parseFloat(form.deductions) || 0,
        payDate: form.payDate ? new Date(form.payDate).toISOString() : undefined,
      };

      const res = await api.post('salary', payload);
      console.log('Salary added:', res.data);
      alert('Salary added successfully!');
      navigate('/admin/salary');
    } catch (err) {
      console.error('Error adding salary:', err.response?.data || err.message);
      alert('Failed to add salary: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-sky-200 via-white to-sky-300
                    transition-all duration-500">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6
                      transform hover:-translate-y-2 hover:shadow-2xl
                      transition-all duration-500
                      opacity-0 animate-fade-in-card">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800 animate-fade-in-card">Add Salary</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/** Staggered inputs/selects with hover lift **/}
          <select
            name="employeeId"
            className="border rounded px-3 py-2 text-sm
                       focus:ring-2 focus:ring-sky-400 focus:outline-none
                       hover:border-sky-400 transition duration-200
                       shadow-inner bg-white animate-fade-in delay-100
                       hover:-translate-y-1 hover:shadow-lg transform"
            value={form.employeeId}
            onChange={handleChange}
          >
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>{e.name}</option>
            ))}
          </select>

          <select
            name="departmentId"
            className="border rounded px-3 py-2 text-sm
                       focus:ring-2 focus:ring-sky-400 focus:outline-none
                       hover:border-sky-400 transition duration-200
                       shadow-inner bg-white animate-fade-in delay-200
                       hover:-translate-y-1 hover:shadow-lg transform"
            value={form.departmentId}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>

          <input
            name="basic"
            placeholder="Basic salary"
            className="border rounded px-3 py-2 text-sm
                       focus:ring-2 focus:ring-sky-400 focus:outline-none
                       hover:border-sky-400 transition duration-200
                       shadow-inner bg-white animate-fade-in delay-300
                       hover:-translate-y-1 hover:shadow-lg transform"
            value={form.basic}
            onChange={handleChange}
          />

          <input
            name="allowance"
            placeholder="Allowance"
            className="border rounded px-3 py-2 text-sm
                       focus:ring-2 focus:ring-sky-400 focus:outline-none
                       hover:border-sky-400 transition duration-200
                       shadow-inner bg-white animate-fade-in delay-400
                       hover:-translate-y-1 hover:shadow-lg transform"
            value={form.allowance}
            onChange={handleChange}
          />

          <input
            name="deductions"
            placeholder="Deductions"
            className="border rounded px-3 py-2 text-sm
                       focus:ring-2 focus:ring-sky-400 focus:outline-none
                       hover:border-sky-400 transition duration-200
                       shadow-inner bg-white animate-fade-in delay-500
                       hover:-translate-y-1 hover:shadow-lg transform"
            value={form.deductions}
            onChange={handleChange}
          />

          <input
            type="date"
            name="payDate"
            className="border rounded px-3 py-2 text-sm
                       focus:ring-2 focus:ring-sky-400 focus:outline-none
                       hover:border-sky-400 transition duration-200
                       shadow-inner bg-white animate-fade-in delay-600
                       hover:-translate-y-1 hover:shadow-lg transform"
            value={form.payDate}
            onChange={handleChange}
          />

          <div className="col-span-full">
            <button
              type="submit"
              className="
                w-full
                px-5 py-3
                bg-gradient-to-r from-sky-600 to-sky-500
                hover:from-sky-700 hover:to-sky-600
                text-white text-base font-semibold
                rounded-lg
                shadow-lg
                transition duration-200
                focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-offset-1
                animate-fade-in delay-700 animate-pulse-btn
              "
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/** Tailwind CSS custom animations **/}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes pulse-btn {
            0%, 100% { box-shadow: 0 0 8px rgba(59, 130, 246, 0.6); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.9); }
          }

          .animate-fade-in { animation: fade-in 0.6s ease forwards; }
          .animate-fade-in-card { animation: fade-in 0.6s ease forwards; }
          .animate-pulse-btn {
            animation: pulse-btn 1.5s ease-in-out infinite 0.8s;
          }

          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-600 { animation-delay: 0.6s; }
          .delay-700 { animation-delay: 0.7s; }
        `}
      </style>
    </div>
  );
};

export default AddSalary;
