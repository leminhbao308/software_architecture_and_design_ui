import { Descriptions, Modal, Table } from "antd";
import { OrderType } from "../../types/order/OrderType";
import { formatPrice } from "../../utils/formatUtils";

interface Props {
  visible: boolean;
  order: OrderType | null;
  onClose: () => void;
}
const OrderDetailModal: React.FC<Props> = ({ visible, order, onClose }) => {
  if (!order) return null;
  const itemColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "pricePerUnit",
      key: "pricePerUnit",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total: number) => formatPrice(total),
    },
  ];

  return (
    <Modal
      open={visible}
      title={`Chi tiết đơn hàng #${order.id}`}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="Tên khách hàng">
          {order.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {order.customerEmail}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {order.customerPhone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          {order.customerAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán" span={2}>
          {order.status === "PAID" ? "Thanh toán online" : "Chưa thanh toán"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={2}>
          {order.status}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" span={2}>
          {formatPrice(order.totalAmount)}
        </Descriptions.Item>
      </Descriptions>

      <h4 style={{ marginTop: "1rem" }}>Danh sách sản phẩm</h4>
      <Table
        dataSource={order.items}
        columns={itemColumns}
        rowKey="productId"
        pagination={false}
        size="small"
      />
    </Modal>
  );
};

export default OrderDetailModal;
