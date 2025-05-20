import { Badge, Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  CloudServerOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  OrderedListOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import AdminService from "../../services/admin/AdminService.ts";
import { ServiceStatusType } from "../../types/admin/ServiceStatusType.ts";
import { getAccessToken } from "../../utils/tokenUtils.ts";

const { Sider } = Layout;

interface SidebarComponentProps {
  onMenuSelect: (key: string) => void;
  onSidebarCollapse: (collapsed: boolean) => void;
  selectedKey: string;
}

const SidebarComponent: React.FC<SidebarComponentProps> = ({
  onMenuSelect,
  onSidebarCollapse,
  selectedKey,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [servicesStatus, setServicesStatus] = useState<ServiceStatusType>({
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const token = getAccessToken();

  const handleCollapsed = (value: boolean) => {
    setCollapsed(value);
    onSidebarCollapse(value);
  };

  useEffect(() => {
    const fetchServicesStatus = async () => {
      try {
        setIsLoading(true);
        const status = await AdminService.checkServicesStatus(token);
        setServicesStatus(status);
      } catch (error) {
        setServicesStatus({ data: [], error: true });
        console.error("Error fetching services status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesStatus();

    // // Set up interval to refresh status every minute
    // const intervalId = setInterval(fetchServicesStatus, 60000);

    // // Clean up interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);

  // Generate service status menu items dynamically based on API response
  const generateServiceStatusItems = () => {
    if (servicesStatus?.error) {
      return [
        {
          key: "service-loading",
          label: (
            <div style={{ padding: "5px 0" }}>
              <Badge status="error" />
              <span style={{ marginLeft: "8px" }}>Lỗi truy vấn dịch vụ</span>
            </div>
          ),
        },
      ];
    }

    if (isLoading || !servicesStatus?.data?.length) {
      return [
        {
          key: "service-loading",
          label: (
            <div style={{ padding: "5px 0" }}>
              <Badge status="processing" />
              <span style={{ marginLeft: "8px" }}>Đang tải dịch vụ...</span>
            </div>
          ),
        },
      ];
    }

    return servicesStatus.data.map((service, index) => ({
      key: `service-${index}`,
      label: (
        <div style={{ padding: "5px 0" }}>
          <Badge status={service.is_online ? "success" : "error"} />
          <span style={{ marginLeft: "8px" }}>{service.service_name}</span>
        </div>
      ),
    }));
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    onMenuSelect(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => handleCollapsed(value)}
      theme="light"
      width={250}
      style={{
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4d61fb",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        {!collapsed ? "DEVICER ADMIN" : "DA"}
      </div>

      {/* Content Container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Main Navigation Section */}
        {!collapsed && (
          <div
            style={{
              padding: "12px 16px 6px",
              color: "#4d61fb",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            QUẢN LÝ HỆ THỐNG
          </div>
        )}

        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          style={{ borderRight: "none" }}
          onClick={handleMenuClick}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Trang chủ",
            },
            {
              key: "products",
              icon: <ShoppingOutlined />,
              label: "Sản phẩm",
            },
            {
              key: "orders",
              icon: <OrderedListOutlined />,
              label: "Hóa đơn",
            },
            {
              key: "categories",
              icon: <AppstoreOutlined />,
              label: "Danh mục",
            },
            {
              key: "payments",
              icon: <CreditCardOutlined />,
              label: "Thanh toán",
            },
          ]}
        />

        {/* System Monitoring Section */}
        {!collapsed && (
          <div
            style={{
              padding: "16px 16px 6px",
              color: "#4d61fb",
              fontWeight: "bold",
              fontSize: "12px",
              marginTop: "10px",
            }}
          >
            GIÁM SÁT HỆ THỐNG
          </div>
        )}

        <Menu
          theme="light"
          selectable={false}
          mode="inline"
          style={{ borderRight: "none" }}
          defaultOpenKeys={["services"]}
          items={[
            {
              key: "services",
              icon: <CloudServerOutlined />,
              label: "Trạng Thái Dịch Vụ",

              children: generateServiceStatusItems(),
            },
          ]}
        />
      </div>
    </Sider>
  );
};

export default SidebarComponent;
