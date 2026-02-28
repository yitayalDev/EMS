import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api, { API_BASE_URL } from "../../utils/api";

const ViewEmployee = () => {
  const { id } = useParams();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`employees/${id}`);
        setEmp(data);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    };
    load();
  }, [id]);

  if (!emp)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-lg">
        Loading employee profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 p-6">
      <div className="max-w-xl mx-auto bg-black/40 backdrop-blur-2xl rounded-2xl p-6 relative shadow-[0_0_30px_rgba(139,92,246,0.8)]">

        {/* Neon Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-green-400 via-lime-400 to-emerald-500 blur-xl opacity-70 animate-neon-border pointer-events-none"></div>

        <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow-lg">
          Employee Profile
        </h2>

        {emp.image && (
          <img
            src={`${API_BASE_URL}${emp.image}`}
            alt={emp.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-white/50 shadow-[0_0_20px_#22c55e]"
          />
        )}

        <div className="text-white space-y-2 text-sm">
          <p><strong>Name:</strong> {emp.name}</p>
          <p><strong>Email:</strong> {emp.email}</p>
          <p><strong>Department:</strong> {emp.department?.name || "-"}</p>
          <p><strong>Position:</strong> {emp.position || "-"}</p>
          <p><strong>DOB:</strong> {emp.dob ? emp.dob.substring(0, 10) : "-"}</p>
          <p><strong>Join Date:</strong> {emp.joinDate ? emp.joinDate.substring(0, 10) : "-"}</p>
          <p><strong>Status:</strong> {emp.status}</p>
        </div>

        {/* Back Button */}
        <Link
          to="/admin/employees"
          className="mt-6 inline-block w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-xl shadow-[0_0_15px_#22c55e] hover:from-green-600 hover:to-green-800 transition-all duration-200"
        >
          Back to Employees
        </Link>
      </div>
    </div>
  );
};

export default ViewEmployee;
