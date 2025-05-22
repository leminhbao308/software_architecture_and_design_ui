import {Flex, Layout, Space} from "antd";
import React from "react";
import UserMenu from "../user/UserMenu.tsx";

const {Header} = Layout

interface HeaderComponentProps {
    currentPage?: string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({currentPage = 'Dashboard'}) => {
    // Map the page keys to display names
    const pageDisplayNames: Record<string, string> = {
        'dashboard': 'Trang chủ',
        'categories': 'Quản Lý Danh Mục',
        'products': 'Quản Lý Sản Phẩm',
        'orders': 'Quản Lý Hóa Đơn',
        'payments': 'Quản Lý Thanh Toán'
    };

    // Get the display name for the current page
    const displayName = pageDisplayNames[currentPage] || 'Dashboard';

    return (
        <Header style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)'
        }}>
            <Flex
                align="center"
                justify="space-between"
                style={{width: "100%"}}
            >
                <div style={{fontSize: '18px', fontWeight: 'bold', color: "black"}}>
                    {displayName}
                </div>

                <Space size="large">
                    <UserMenu/>
                </Space>
            </Flex>
        </Header>
    )
}

export default HeaderComponent
