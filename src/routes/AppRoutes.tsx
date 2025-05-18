import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Header from "../components/layouts/header";
import SignUpPage from "../pages/signupPage";
import ProtectedRoute from "./ProtecedRoute";
import Homepage from "../pages/HomePage";
import ProductDetail from "../pages/products/ProductDetail";
import ProductsPage from "../pages/products/ProductsPage";
import SearchResultsPage from "../pages/SearchResultPage";
import UserInfoPage from "../pages/UserInfoPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import CheckoutSuccessPage from "../pages/checkout/CheckoutSuccessPage";
import CheckoutCancelPage from "../pages/checkout/CheckoutCancelPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import OrderDetailPage from "../pages/order/OrderDetailPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import PathConst from "../consts/PathConst";

const AppContent = () => {
    const location = useLocation();

    // Kiểm tra nếu đường dẫn bắt đầu bằng admin dashboard thì ẩn Header
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Header />}
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/auth-callback" element={<AuthCallbackPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/product-detail" element={<ProductDetail />} />
                    <Route path="/products/:categoryId" element={<ProductsPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/profile" element={<UserInfoPage />} />
                    <Route path="/cart" element={<CartPage marginTop={true} />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    {/* Order routes */}
                    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                    <Route path="/orders/payment/success" element={<CheckoutSuccessPage />} />
                    <Route path="/orders/payment/cancel" element={<CheckoutCancelPage />} />

                    {/* Admin routes */}
                    <Route path={PathConst.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
                </Route>
            </Routes>
        </>
    );
};

const AppRoutes = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default AppRoutes;
