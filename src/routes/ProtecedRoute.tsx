import {Navigate, Outlet} from "react-router-dom";
import {isAuthenticated} from "../services/auth/AuthService";

const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
