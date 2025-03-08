import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/devicer-white.png";
import PathConst from "../../consts/PathConst";
import { isAuthenticated } from "../../services/auth/AuthService";
import CategoryBtn from "../category/CategoryComponent";
import SearchInput from "../SearchInput";
import CartComponent from "../cart/CartComponent";
import UserMenu from "../user/UserMenu"; // ✅ Import new UserMenu component

const Header = () => {
  const location = useLocation();

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

        {/* Use UserMenu Component for authenticated users */}
        {isAuthenticated() ? (
          <UserMenu />
        ) : (
          <div className="header-action">
            {location.pathname === PathConst.LOGIN ? (
              <Link to={PathConst.SIGNUP} className="auth-link">Sign Up</Link>
            ) : (
              <Link to={PathConst.LOGIN} className="auth-link">Log In</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;