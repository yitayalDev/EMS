import { useAuth } from "../context/AuthContext.jsx";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/dashboard/AdminSidebar.jsx";
import Navbar from "../components/dashboard/Navbar.jsx";
import AdminSummary from "../components/dashboard/AdminSummary.jsx";
import DepartmentList from "../components/department/DepartmentList.jsx";
import AddDepartment from "../components/department/AddDepartment.jsx";
import EditDepartment from "../components/department/EditDepartment.jsx";
import EmployeeList from "../components/employee/EmployeeList.jsx";
import AddEmployee from "../components/employee/AddEmployee.jsx";
import ViewEmployee from "../components/employee/ViewEmployee.jsx";
import LeaveList from "../components/leaves/LeaveList.jsx";
import LeaveDetails from "../components/leaves/LeaveDetails.jsx";
import SalaryList from "../components/salary/SalaryList.jsx";
import AddSalary from "../components/salary/AddSalary.jsx";
import Setting from "../components/employeeDashboard/Setting.jsx";
import { useState, useEffect } from "react";
import api from "../utils/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 space-y-4">
          <Routes>
            <Route path="" element={<AdminSummary />} />

            {isAdmin && (
              <>
                <Route path="departments" element={<DepartmentList />} />
                <Route path="departments/add" element={<AddDepartment />} />
                <Route path="departments/:id/edit" element={<EditDepartment />} />
              </>
            )}

            {isAdmin && (
              <>
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/:id" element={<ViewEmployee />} />
                <Route path="employees/:id/edit" element={<EditEmployeeInline />} />
              </>
            )}

            {isAdmin && (
              <>
                <Route path="leaves" element={<LeaveList />} />
                <Route path="leaves/:id" element={<LeaveDetails />} />
              </>
            )}

            {isAdmin && (
              <>
                <Route path="salary" element={<SalaryList />} />
                <Route path="salary/add" element={<AddSalary />} />
              </>
            )}

            <Route path="settings" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const EditEmployeeInline = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    departmentId: "",
    position: "",
    joinDate: "",
    status: "active",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, depRes] = await Promise.all([
          api.get(`employees/${id}`),
          api.get("departments"),
        ]);

        const emp = empRes.data;
        setForm({
          name: emp.name || "",
          dob: emp.dob ? emp.dob.substring(0, 10) : "",
          departmentId: emp.department?._id || "",
          position: emp.position || "",
          joinDate: emp.joinDate ? emp.joinDate.substring(0, 10) : "",
          status: emp.status || "active",
        });
        setDepartments(depRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);

    try {
      await api.put(`employees/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <input name="name" placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={handleChange} />
        <input type="date" name="dob" className="border rounded px-3 py-2" value={form.dob} onChange={handleChange} />
        <select name="departmentId" className="border rounded px-3 py-2" value={form.departmentId} onChange={handleChange}>
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <input name="position" placeholder="Position" className="border rounded px-3 py-2" value={form.position} onChange={handleChange} />
        <input type="date" name="joinDate" className="border rounded px-3 py-2" value={form.joinDate} onChange={handleChange} />
        <select name="status" className="border rounded px-3 py-2" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input type="file" accept="image/*" className="col-span-full border rounded px-3 py-2" onChange={(e) => setImage(e.target.files[0])} />
        <div className="col-span-full pt-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Update Info</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
