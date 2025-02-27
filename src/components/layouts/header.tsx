import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/devicer-white.png";
import PathConst from "../../consts/PathConst";
const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="header-logo">
          <Link to={PathConst.HOME}>
            <img
              src={Logo}
              alt="logo devicer store"
              title="logo devicer store"
            />
          </Link>
        </div>
        <div className="header-action">
          {/* Hangdle show Link by path login or signup */}
          {location.pathname === PathConst.LOGIN ? (
            <Link to={PathConst.SIGNUP}>SignUp</Link>
          ) : (
            <Link to={PathConst.LOGIN}>LogIn</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
