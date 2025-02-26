import { Link } from "react-router-dom";
import Logo from "../../assets/devicer-white.png";
const Header = () => {
  return (
    <header className="header">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="header-logo">
          <img src={Logo} alt="logo devicer store" title="logo devicer store" />
        </div>
        <div className="header-action">
          <Link to="signup">SignUp</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
