import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AssetsConstant from "../../consts/AssetsConstant";
import PathConst from "../../consts/PathConst";
import { logout } from "../../services/auth/AuthService";

const UserMenu = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate(PathConst.LOGIN, { replace: true });
  }, [navigate]);

  return (
    <div 
      className="user-container"
      onMouseEnter={() => setShowUserMenu(true)}
      onMouseLeave={() => setShowUserMenu(false)}
      role="menu"
      aria-label="User menu"
    >
      <div className="user-btn">
        <img 
          src={AssetsConstant.USER_ICON} 
          alt="User Icon" 
        className="user-btn-img user-icon"
        />
      </div>

      {/* Dropdown menu */}
      {showUserMenu && (
        <ul className="user-dropdown">
          <li className="user-option">User Info</li>
          <li className="user-option" onClick={handleLogout}>Log Out</li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;