import { useAuth } from "../context/AuthContext.jsx";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/dashboard/AdminSidebar.jsx";
import Navbar from "../components/dashboard/Navbar.jsx";
import AdminSummary from "../components/dashboard/AdminSummary.jsx";
import Analytics from "../components/dashboard/Analytics.jsx";
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
import AttendanceList from "../components/dashboard/AttendanceList.jsx";
import BillingDashboard from "../components/dashboard/BillingDashboard.jsx";
import CompanySettings from "../components/dashboard/CompanySettings.jsx";
import AssetList from "../components/asset/AssetList.jsx";
import { useState, useEffect } from "react";
import api from "../utils/api";

const AdminDashboard = () => {
  const { user, can } = useAuth();

  const canViewAnalytics = can('view_analytics');
  const canViewEmployees = can('manage_users');
  const canViewDepartments = can('manage_departments');
  const canViewLeaves = can('manage_leaves');
  const canViewSalary = can('view_salary') || can('manage_salary');
  const canViewAttendance = can('manage_attendance');

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <AdminSidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 space-y-4">
          <Routes>
            <Route path="" element={<AdminSummary />} />
            {canViewAnalytics && <Route path="analytics" element={<Analytics />} />}

            {canViewDepartments && (
              <>
                <Route path="departments" element={<DepartmentList />} />
                <Route path="departments/add" element={<AddDepartment />} />
                <Route path="departments/:id/edit" element={<EditDepartment />} />
              </>
            )}

            {canViewEmployees && (
              <>
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/:id" element={<ViewEmployee />} />
                <Route path="employees/:id/edit" element={<EditEmployeeInline />} />
              </>
            )}

            {canViewLeaves && (
              <>
                <Route path="leaves" element={<LeaveList />} />
                <Route path="leaves/:id" element={<LeaveDetails />} />
              </>
            )}

            {canViewSalary && (
              <>
                <Route path="salary" element={<SalaryList />} />
                <Route path="salary/add" element={<AddSalary />} />
              </>
            )}

            {canViewAttendance && (
              <Route path="attendance" element={<AttendanceList />} />
            )}

            {(user?.role === 'admin' || user?.role === 'finance') && (
              <Route path="billing" element={<BillingDashboard />} />
            )}

            <Route path="assets" element={<AssetList />} />


            {(user?.role === 'admin') && (
              <Route path="company-settings" element={<CompanySettings />} />
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
    <div className="max-w-xl bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-5 transition-colors">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-900 dark:text-gray-100">
        <input name="name" placeholder="Name" className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.name} onChange={handleChange} />
        <input type="date" name="dob" className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.dob} onChange={handleChange} />
        <select name="departmentId" className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.departmentId} onChange={handleChange}>
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
        <input name="position" placeholder="Position" className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.position} onChange={handleChange} />
        <input type="date" name="joinDate" className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.joinDate} onChange={handleChange} />
        <select name="status" className="border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" value={form.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input type="file" accept="image/*" className="col-span-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2.5 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-indigo-100 dark:file:bg-indigo-900 file:text-indigo-700 dark:file:text-indigo-200" onChange={(e) => setImage(e.target.files[0])} />
        <div className="col-span-full pt-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Update Info</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
