import {useNavigate} from "react-router-dom";
import type {MenuProps} from "antd";
import {Avatar, Dropdown, Tooltip} from "antd";
import {DisconnectOutlined, LockOutlined, LogoutOutlined, UserOutlined} from "@ant-design/icons";
import PathConst from "../../consts/PathConst";
import {logout} from "../../services/auth/AuthService";
import { isAdmin } from "../../services/auth/AuthService";
import useUserContext from "../../hooks/useUserContext.ts";

const UserMenu = () => {
    const navigate = useNavigate();
    const {userInfo} = useUserContext();

    const isAdminPage = location.pathname.startsWith("/admin");

    const handleAdminPage = () => {
        navigate(PathConst.ADMIN_DASHBOARD, {replace: true});
    }

    const handleBackToShop = () => {
        navigate(PathConst.HOME, {replace: true});
    }

    const handleUserProfile = () => {
        navigate(PathConst.PROFILE, {replace: true});
    }

    const handleLogout = () => {
        logout();
        navigate(PathConst.LOGIN, {replace: true});
    };

    // Define menu items based on whether user is on admin page or not
    const items: MenuProps['items'] = [
        // Show "Admin Page" button only when NOT on admin pages and user is admin
        ...(!isAdminPage && isAdmin() ? [{
            key: 'adminPage',
            label: 'Trang thông tin admin',
            icon: <LockOutlined/>,
            onClick: handleAdminPage
        }] : []),

        // Show "Back to Shop" button only when ON admin pages
        ...(isAdminPage ? [{
            key: 'quitAdminPage',
            label: 'Quay về cửa hàng',
            icon: <DisconnectOutlined/>,
            onClick: handleBackToShop
        }] : []),

        // Always show these options
        {
            key: 'userInfo',
            label: 'Thông tin khách hàng',
            icon: <UserOutlined/>,
            onClick: handleUserProfile
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined/>,
            onClick: handleLogout,
        },
    ];

    return (
        <Dropdown
            menu={{items}}
            trigger={['hover']}
            placement="bottomLeft"
        >
            <Tooltip
                title={userInfo?.name}
                color={"gray"}
                key={"user-profile"}
                placement={"right"}
                mouseEnterDelay={0}
                mouseLeaveDelay={0}
            >
                <Avatar
                    size={48}
                    style={{background: "gray", cursor: "pointer"}}
                    icon={<UserOutlined/>}/>
            </Tooltip>
        </Dropdown>
    );
};

export default UserMenu;
