import React, { useEffect, useState } from "react";
import { Button, Empty, Spin, Table, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatUtils";
import { getAccessToken } from "../utils/tokenUtils";
import OrderService from "../services/cart/OrderService.ts";
import useUserContext from "../hooks/useUserContext.ts";
import { OrderType } from "../types/order/OrderType.ts";

const { Title } = Typography;

const OrderHistoryComponent: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUserContext();

  const token = getAccessToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await OrderService.getUserOrders(token, userId);
        setOrders(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch order history:", err);
        setError("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

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
      render: (id: number) => <Link to={`/orders/${id}`}>{`#${id}`}</Link>,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (record: OrderType) => (
        <Button type="primary" size="middle">
          <Link style={{ textDecoration: "none" }} to={`/orders/${record.id}`}>
            Xem chi tiết
          </Link>
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

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Empty
          description="Bạn chưa có đơn hàng nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" style={{ marginTop: "16px" }}>
          <Link to="/">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Title level={4}>Lịch sử đơn hàng</Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default OrderHistoryComponent;
