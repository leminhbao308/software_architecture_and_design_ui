import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/devicer-white.png";
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
        <div className="header-logo">
          <Link to={PathConst.HOME}>
            <img
              src={Logo}
              alt="logo devicer store"
              title="logo devicer store"
            />
          </Link>
        </div>
        {isAuthenticated() && (
          <>
            <CategoryBtn />
            <SearchInput />
            <CartComponent />
          </>
        )}

        <div className="header-action">
          {isAuthenticated() ? (
            <button className="btn-logout" onClick={handleLogout}>
              Log Out
            </button>
          ) : location.pathname === PathConst.LOGIN ? (
            <Link to={PathConst.SIGNUP}>Sign Up</Link>
          ) : (
            <Link to={PathConst.LOGIN}>Log In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
