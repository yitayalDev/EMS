import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles, requiredPermission }) => {
  const { user, can } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const hasRole = allowedRoles ? allowedRoles.includes(user.role) : true;
  const hasPermission = requiredPermission ? can(requiredPermission) : true;

  return (hasRole && hasPermission) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRoute;
