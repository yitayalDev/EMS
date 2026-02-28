import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
import RoleBasedRoute from "./utils/RoleBasedRoute.jsx";

import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx"; // ✅ added
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ added */}

      <Route element={<PrivateRoute />}>
        <Route element={<RoleBasedRoute allowedRoles={["admin", "hr", "finance", "it_admin"]} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        <Route element={<RoleBasedRoute allowedRoles={["employee"]} />}>
          <Route path="/employee/*" element={<EmployeeDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  </AuthProvider>
);

export default App;
