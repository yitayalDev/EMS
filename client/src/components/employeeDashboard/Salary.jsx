import { useEffect, useState } from 'react';
import api from '../../utils/api.js';

const Salary = () => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🌈 Background gradient state
  const gradients = [
    'from-green-300 via-green-400 to-green-500',
    'from-yellow-300 via-yellow-400 to-yellow-500',
    'from-lime-300 via-lime-400 to-lime-500',
    'from-emerald-300 via-emerald-400 to-emerald-500',
    'from-cyan-300 via-cyan-400 to-cyan-500',
  ];
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length);
    }, 5000); // change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadSalary = async () => {
      try {
        const { data } = await api.get('salary/my');
        setSalary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load salary details');
      } finally {
        setLoading(false);
      }
    };
    loadSalary();
  }, []);

  if (loading) return <div className="p-4">Loading salary...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!salary) return <div className="p-4">No salary record found.</div>;

  return (
    <div
      className={`p-6 rounded shadow
                  bg-gradient-to-br ${gradients[gradientIndex]}
                  transition-all duration-1000`}
    >
      <h2 className="text-xl font-bold mb-4">My Salary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold">Basic Salary:</span> {salary.basic ?? '-'}</div>
        <div><span className="font-semibold">Allowances:</span> {salary.allowance ?? 0}</div>
        <div><span className="font-semibold">Deductions:</span> {salary.deductions ?? 0}</div>
        <div>
          <span className="font-semibold">Net Salary:</span>{' '}
          <span className="text-green-700 font-bold">{salary.netSalary ?? '-'}</span>
        </div>
        <div><span className="font-semibold">Pay Date:</span> {salary.payDate ? new Date(salary.payDate).toLocaleDateString('en-GB') : '-'}</div>
        <div><span className="font-semibold">Department:</span> {salary.department?.name ?? '-'}</div>
      </div>
    </div>
  );
};

export default Salary;
