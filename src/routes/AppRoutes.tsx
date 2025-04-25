import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Header from "../components/layouts/header";
import SignUpPage from "../pages/signupPage";
import ProtectedRoute from "./ProtecedRoute";
import Homepage from "../pages/HomePage";
import ProductDetail from "../pages/products/ProductDetail";
import ProductsPage from "../pages/products/ProductsPage.tsx";
import SearchResultsPage from "../pages/SearchResultPage.tsx";
import UserInfoPage from "../pages/UserInfoPage.tsx";
import CartPage from "../pages/CartPage.tsx";
import CheckoutPage from "../pages/checkout/CheckoutPage.tsx";
import CheckoutSuccessPage from "../pages/checkout/CheckoutSuccessPage.tsx";
import CheckoutCancelPage from "../pages/checkout/CheckoutCancelPage.tsx";
import AuthCallbackPage from "../pages/AuthCallbackPage.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Header/>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
                <Route path="/auth-callback" element={<AuthCallbackPage/>}/>

                {/* Protected routes */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/product-detail" element={<ProductDetail/>}/>
                    <Route path="/products/:categoryId" element={<ProductsPage/>}/>
                    <Route path="/search" element={<SearchResultsPage/>}/>

                    <Route path="/profile" element={<UserInfoPage/>}/>

                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/checkout" element={<CheckoutPage/>}/>
                    <Route path="/orders/payment/success" element={<CheckoutSuccessPage/>}/>
                    <Route path="/orders/payment/cancel" element={<CheckoutCancelPage/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
