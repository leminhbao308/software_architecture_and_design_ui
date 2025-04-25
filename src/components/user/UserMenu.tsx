import {useNavigate} from "react-router-dom";
import {Dropdown, Space, Button, Avatar, Tooltip} from "antd";
import type {MenuProps} from "antd";
import {UserOutlined, LogoutOutlined} from "@ant-design/icons";
import PathConst from "../../consts/PathConst";
import {logout} from "../../services/auth/AuthService";
import useUserContext from "../../hooks/useUserContext.ts";

const UserMenu = () => {
    const navigate = useNavigate();
    const {userInfo} = useUserContext();

    const handleUserProfile = () => {
        navigate(PathConst.PROFILE, {replace: true});
    }

    const handleLogout = () => {
        logout();
        navigate(PathConst.LOGIN, {replace: true});
    };

    const items: MenuProps['items'] = [
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
                    icon={<UserOutlined />} />
            </Tooltip>
        </Dropdown>
    );
};

export default UserMenu;
