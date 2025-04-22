import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Header from "../components/layouts/header";
import SignUpPage from "../pages/signupPage";
import ProtectedRoute from "./ProtecedRoute";
import Homepage from "../pages/HomePage";
import ProductDetail from "../pages/products/ProductDetail";
import ProductsPage from "../pages/products/ProductsPage.tsx";
import SearchResultsPage from "../pages/SearchResultPage.tsx";

const AppRoutes = () => {
    return (
        <Router>
            <Header/>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>

                {/* Protected routes */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/" element={<Homepage/>}/>
                    <Route path="/product-detail" element={<ProductDetail/>}/>
                    <Route path="/products/:categoryId" element={<ProductsPage/>}/>
                    <Route path="/search" element={<SearchResultsPage/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
