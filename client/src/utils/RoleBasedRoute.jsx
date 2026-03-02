import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles, requiredPermission }) => {
  const { user, can } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  // Admin always has access
  if (user.role === 'admin') return <Outlet />;

  // Check if role is allowed
  const hasRole = allowedRoles ? allowedRoles.includes(user.role) : true;

  // Special Case: If we are restricting to "admin" role, but this is an employee with admin permissions
  // we check if they have specific permissions like 'manage_users'
  const adminPermissions = ['manage_users', 'manage_departments', 'view_salary', 'manage_salary', 'manage_leaves', 'manage_assets', 'manage_notices', 'view_analytics'];
  const hasAnyAdminPermission = user.permissions?.some(p => adminPermissions.includes(p));

  const isAllowedByRoleOrPermission = hasRole || (allowedRoles?.includes('admin') && hasAnyAdminPermission);
  const isAllowedBySpecificPermission = requiredPermission ? can(requiredPermission) : true;

  return (isAllowedByRoleOrPermission && isAllowedBySpecificPermission) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRoute;
