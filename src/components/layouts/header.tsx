import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/devicer-white.png";
import AssetsConstant from "../../consts/AssetsConstant"; // Import AssetsConstant
import PathConst from "../../consts/PathConst";
import { isAuthenticated, logout } from "../../services/auth/AuthService";
import CategoryBtn from "../category/CategoryComponent";
import SearchInput from "../SearchInput";
import CartComponent from "../cart/CartComponent";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PathConst.LOGIN, { replace: true });
  };

  return (
    <header className="header">
      <div className="container header-container d-flex justify-content-between align-items-center py-3">
        {/* Logo */}
        <div className="header-logo">
          <Link to={PathConst.HOME}>
            <img src={Logo} alt="logo devicer store" title="logo devicer store" />
          </Link>
        </div>

        {/* Chỉ hiển thị nếu đã đăng nhập */}
        {isAuthenticated() && (
          <>
            <CategoryBtn />
            <SearchInput />
            <CartComponent />
          </>
        )}

        {/* User Icon & Dropdown - Tái sử dụng category-container */}
        <div className="category-container">
          {isAuthenticated() ? (
            <>
              <div className="category-btn">
                <img src={AssetsConstant.USER_ICON} alt="User Icon" className="category-btn-img user-icon" />
                <p className="category-btn-title">Tài khoản</p>
              </div>
              <ul className="categories">
                <li className="category">User Info</li>
                <li className="category" onClick={handleLogout}>Log Out</li>
              </ul>
            </>
          ) : location.pathname === PathConst.LOGIN ? (
            <Link to={PathConst.SIGNUP} className="auth-link" >Sign Up</Link>
          ) : (
            <Link to={PathConst.LOGIN} className="auth-link" >Log In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;