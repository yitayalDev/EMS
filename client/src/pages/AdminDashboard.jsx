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
import LeaveList from "../components/leave/LeaveList.jsx";
import LeaveDetails from "../components/leave/LeaveDetails.jsx";
import SalaryList from "../components/salary/SalaryList.jsx";
import AddSalary from "../components/salary/AddSalary.jsx";
import AdminSettings from "../pages/AdminSettings.jsx";
import { useState, useEffect } from "react";
import api from "../utils/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isHR = user?.role === 'hr';
  const isFinance = user?.role === 'finance';
  const isIT = user?.role === 'it_admin';

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 space-y-4">
          <Routes>
            <Route path="" element={<AdminSummary />} />

            {(isAdmin || isHR || isIT) && (
              <>
                <Route path="departments" element={<DepartmentList />} />
                <Route path="departments/add" element={<AddDepartment />} />
                <Route path="departments/:id/edit" element={<EditDepartment />} />
              </>
            )}

            {(isAdmin || isHR || isIT) && (
              <>
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/:id" element={<ViewEmployee />} />
                <Route path="employees/:id/edit" element={<EditEmployeeInline />} />
              </>
            )}

            {(isAdmin || isHR) && (
              <>
                <Route path="leaves" element={<LeaveList />} />
                <Route path="leaves/:id" element={<LeaveDetails />} />
              </>
            )}

            {(isAdmin || isHR || isFinance || user?.permissions?.includes('view_salary') || user?.permissions?.includes('manage_salary')) && (
              <>
                <Route path="salary" element={<SalaryList />} />
                <Route path="salary/add" element={<AddSalary />} />
              </>
            )}

            <Route path="settings" element={<AdminSettings />} />
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
  const [permForm, setPermForm] = useState({
    role: "employee",
    permissions: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, depRes] = await Promise.all([
          api.get(`/employees/${id}`),
          api.get("/departments"),
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
        setPermForm({
          role: emp.user?.role || "employee",
          permissions: emp.user?.permissions || [],
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
      await api.put(`/employees/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermChange = (e) => {
    setPermForm((f) => ({ ...f, role: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setPermForm((f) => {
      const perms = new Set(f.permissions);
      if (e.target.checked) perms.add(value);
      else perms.delete(value);
      return { ...f, permissions: Array.from(perms) };
    });
  };

  const handlePermSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/employees/${id}/permissions`, permForm);
      alert("Role and permissions updated successfully!");
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

      <hr className="my-6 border-gray-200" />

      <h2 className="text-lg font-semibold mb-3 text-gray-800">Manage Role & Permissions</h2>
      <form onSubmit={handlePermSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block font-medium mb-1 text-gray-700">Role</label>
          <select value={permForm.role} onChange={handlePermChange} className="border rounded px-3 py-2 w-full md:w-1/2">
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
            <option value="it_admin">IT Admin</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Custom Permissions</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'view_salary', label: 'View Salary' },
              { id: 'manage_salary', label: 'Manage Salary' },
              { id: 'delete_records', label: 'Delete Records' },
              { id: 'manage_users', label: 'Manage Users' },
            ].map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" value={p.id} checked={permForm.permissions.includes(p.id)} onChange={handleCheckboxChange} className="rounded" />
                {p.label}
              </label>
            ))}
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition">Update Role & Permissions</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
