import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = allowedRoles.includes(user.role);

  return hasAccess ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RoleBasedRoute;
