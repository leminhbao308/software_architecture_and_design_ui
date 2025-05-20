import { useEffect, useState } from "react";
import OrderService from "../../../services/cart/OrderService";
import { getAccessToken } from "../../../utils/tokenUtils";
import { OrderType } from "../../../types/order/OrderType";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { formatPrice } from "../../../utils/formatUtils";
import OrderDetailModal from "../../popups/OrderDetailModal";
import { Content } from "antd/es/layout/layout";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import RevenueReportModal from "../../popups/RevenueReportModal";

const { Title } = Typography;

const OrderManagementComponent: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState<string>("");
  const [searchCustomerPhone, setSearchCustomerPhone] = useState<string>("");
  const [searchCustomerEmail, setSearchCustomerEmail] = useState<string>("");
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
  const [isReportModalVisible, setIsRevenueReportModalVisible] =
    useState(false);

  const accessToken = getAccessToken();

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getAllOrders(accessToken);
      setOrders(response);
      setFilteredOrders(response);
      setError(null);
    } catch (err) {
      console.log("Get all orders is fail: ", err);
      setError("Không thể tải hóa đơn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [accessToken]);

  const getStatusTag = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Tag style={{ padding: "5px 12px" }} color="success">
            Đã thanh toán
          </Tag>
        );
      case "AWAITING_PAYMENT":
        return (
          <Tag style={{ padding: "5px 12px" }} color="processing">
            Chờ thanh toán
          </Tag>
        );
      case "CANCELLED":
        return (
          <Tag style={{ padding: "5px 12px" }} color="error">
            Đã hủy
          </Tag>
        );
      default:
        return (
          <Tag style={{ padding: "5px 12px" }} color="default">
            {status}
          </Tag>
        );
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id: number) => id,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (customerName: string) => customerName,
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
      render: (customerPhone: string) => customerPhone,
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
      render: (customerEmail: string) => customerEmail,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => formatPrice(amount),
    },

    {
      title: "Chi tiết",
      key: "action",
      render: (record: OrderType) => (
        <Button
          type="primary"
          size="middle"
          onClick={() => handleViewDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "40px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  const handleViewDetail = (order: OrderType) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleSearch = () => {
    const filtered = orders.filter((order) => {
      const matchOrderId = searchOrderId
        ? order.id.toString().includes(searchOrderId.trim())
        : true;
      const matchPhone = searchCustomerPhone
        ? order.customerPhone
            ?.toLowerCase()
            .includes(searchCustomerPhone.trim().toLowerCase())
        : true;
      const matchEmail = searchCustomerEmail
        ? order.customerEmail
            ?.toLowerCase()
            .includes(searchCustomerEmail.trim().toLowerCase())
        : true;
      return matchOrderId && matchPhone && matchEmail;
    });
    setFilteredOrders(filtered);
  };

  const resetPage = () => {
    setSearchOrderId("");
    setSearchCustomerPhone("");
    setSearchCustomerEmail("");
    setFilteredOrders(orders);
  };

  const showReportModal = () => {
    setIsRevenueReportModalVisible(true);
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: "#f5f7fa",
        overflow: "auto",
      }}
    >
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Title level={4}>Quản Lý Sản Phẩm</Title>
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => showReportModal()}
            >
              Report
            </Button>
          </Space>
        </div>

        <Form layout="vertical">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Form.Item
              label="Mã hóa đơn"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập mã hóa đơn"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              style={{ flex: 1, minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập số điện thoại"
                value={searchCustomerPhone}
                onChange={(e) => setSearchCustomerPhone(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item label="Email" style={{ flex: 1, minWidth: "200px" }}>
              <Input
                placeholder="Nhập email"
                value={searchCustomerEmail}
                onChange={(e) => setSearchCustomerEmail(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
            <Button onClick={resetPage}>Đặt Lại</Button>
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              loading={loading}
            >
              Tìm Kiếm
            </Button>
          </div>
        </Form>
      </Card>
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Đơn hàng</Title>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <OrderDetailModal
          visible={isModalVisible}
          order={selectedOrder}
          onClose={handleCloseModal}
        />
        <RevenueReportModal
          visible={isReportModalVisible}
          orders={orders}
          onClose={() => setIsRevenueReportModalVisible(false)}
        />
      </Card>
    </Content>
  );
};

export default OrderManagementComponent;
