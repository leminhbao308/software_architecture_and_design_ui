import React, { useState } from "react";
import { Layout } from "antd";
import SidebarComponent from "../../components/admin/SidebarComponent.tsx";
import HeaderComponent from "../../components/admin/HeaderComponent.tsx";
import DashboardComponent from "../../components/admin/DashboardComponent.tsx";
import CategoryManagementComponent from "../../components/admin/management/CategoryManagementComponent.tsx";
import ProductManagementComponent from "../../components/admin/management/ProductManagementComponent.tsx";
import OrderManagementComponent from "../../components/admin/management/OrderManagementComponent.tsx";

const { Content } = Layout;

const AdminDashboardPage: React.FC = () => {
  // Calculate sidebar width based on collapsed state
  const [sidebarWidth, setSidebarWidth] = useState(250);

  // State to track the currently selected menu item
  const [selectedKey, setSelectedKey] = useState("dashboard");

  // Handle menu selection from sidebar
  const handleMenuSelect = (key: string) => {
    setSelectedKey(key);
  };

  const handleSidebarCollapse = (collapsed: boolean) => {
    if (collapsed) setSidebarWidth(80);
    else setSidebarWidth(250);
  };

  // Render the appropriate component based on the selected key
  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return <DashboardComponent />;
      case "categories":
        return <CategoryManagementComponent />;
      case "products":
        return <ProductManagementComponent />;
      case "orders":
        return <OrderManagementComponent />;
      // Add other cases for future components
      default:
        return <DashboardComponent />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar with menu selection handler and current selected key */}
      <SidebarComponent
        onMenuSelect={handleMenuSelect}
        onSidebarCollapse={handleSidebarCollapse}
        selectedKey={selectedKey}
      />

      <Layout style={{ marginLeft: sidebarWidth }}>
        <HeaderComponent currentPage={selectedKey} />

        <Content>{renderContent()}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardPage;
