import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Header from "../components/layouts/header";
import SignUpPage from "../pages/signupPage";
import ProtectedRoute from "./ProtecedRoute";
import Homepage from "../pages/HomePage";

const AppRoutes = () => {
  return (
    <Router>
      <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />
          </Route>
        </Routes>
    </Router>
  );
};

export default AppRoutes;
