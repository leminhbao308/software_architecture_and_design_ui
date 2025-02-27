import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth/AuthService";
const ProtectedRoute: React.FC = () => {
  console.log(sessionStorage.getItem("access_token"));

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
