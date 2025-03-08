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
      className="category-container user-menu"
      onMouseEnter={() => setShowUserMenu(true)}
      onMouseLeave={() => setShowUserMenu(false)}
      role="menu"
      aria-label="User menu"
    >
      <div className="category-btn">
        <img 
          src={AssetsConstant.USER_ICON} 
          alt="User Icon" 
          className="category-btn-img user-icon"
        />
        <p className="category-btn-title">Tài khoản</p>
      </div>

      {/* Dropdown menu */}
      {showUserMenu && (
        <ul className="categories">
          <li className="category">User Info</li>
          <li className="category" onClick={handleLogout}>Log Out</li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;