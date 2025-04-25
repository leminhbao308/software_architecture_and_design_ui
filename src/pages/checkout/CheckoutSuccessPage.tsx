import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button, Card, Descriptions, Divider, Result, Spin, Typography} from 'antd';
import {CheckCircleFilled, FileTextOutlined, ShoppingOutlined} from '@ant-design/icons';
import useUserContext from "../../hooks/useUserContext.ts";
import {getAccessToken} from "../../utils/tokenUtils.ts";
import PaymentService from "../../services/cart/PaymentService.ts";
import {formatPrice} from "../../utils/formatUtils.tsx";
import {OrderType} from "../../types/order/OrderType.ts";
import ProductGrid from "../../components/products/ProductGrid.tsx";

const { Title, Text } = Typography;

const CheckoutSuccessPage: React.FC = () => {
    const { userInfo: currentUser } = useUserContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode') || sessionStorage.getItem('lastOrderCode');

    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderType|null>(null);
    const [error, setError] = useState<string | null>(null);

    const token = getAccessToken();

    useEffect(() => {
        const updatePaymentStatus = async () => {
            try {
                if (!orderCode) {
                    setError('Không tìm thấy mã đơn hàng');
                    setLoading(false);
                    return;
                }

                if (status === "PAID")
                    await PaymentService.updateOrderStatus(token, orderCode);
            } catch (err) {
                console.error('Failed to update order status:', err);
                setError('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        const fetchOrderDetails = async () => {
            try {
                if (!orderId) {
                    setError('Không tìm thấy mã đơn hàng');
                    setLoading(false);
                    return;
                }

                const details = await PaymentService.getOrderDetails(token, orderId);
                setOrderDetails(details);

                // Clean up the sessionStorage after fetching details
                sessionStorage.removeItem('lastOrderCode');
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                setError('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        updatePaymentStatus().then(() => {
            fetchOrderDetails();
        });
    }, [orderId, currentUser]);

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate(`/orders/${orderId}`);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error || !orderDetails) {
        return (
            <div className="container" style={{ marginTop: '100px' }}>
                <Result
                    status="error"
                    title="Có lỗi xảy ra"
                    subTitle={error || 'Không thể hiển thị thông tin đơn hàng'}
                    extra={[
                        <Button type="primary" key="home" onClick={handleContinueShopping}>
                            Tiếp tục mua sắm
                        </Button>
                    ]}
                />
            </div>
        );
    }

    // Success content
    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <Card>
                <Result
                    icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
                    status="success"
                    title="Thanh toán thành công!"
                    subTitle={
                        <div>
                            <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được thanh toán thành công.</p>
                            <p>Mã đơn hàng: <Text strong>{orderCode || orderId}</Text></p>
                        </div>
                    }
                    extra={[
                        <Button type="primary" key="console" icon={<ShoppingOutlined />} onClick={handleContinueShopping}>
                            Tiếp tục mua sắm
                        </Button>,
                        <Button key="orders" icon={<FileTextOutlined />} onClick={handleViewOrders}>
                            Xem đơn hàng
                        </Button>
                    ]}
                />

                <Divider />

                <Title level={4}>Chi tiết đơn hàng</Title>
                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Mã đơn hàng">{orderCode}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Text type="success" strong>{orderDetails.status === "PAID" ? "Đã thanh toán" : orderDetails.status}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên khách hàng">{orderDetails.customerName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{orderDetails.customerEmail}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{orderDetails.customerPhone}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{orderDetails.customerAddress}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                        <Text type="danger" strong>{formatPrice(orderDetails.totalAmount)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">{orderDetails.paymentMethod || 'Thanh toán trực tuyến'}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4}>Sản phẩm đã đặt</Title>
                <ProductGrid orderDetails={orderDetails}/>
            </Card>
        </div>
    );
};

export default CheckoutSuccessPage;
