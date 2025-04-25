import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Button, Result, Spin, Descriptions, Divider } from 'antd';
import { CheckCircleFilled, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
import useUserContext from "../../hooks/useUserContext.ts";
import {getAccessToken} from "../../utils/tokenUtils.ts";
import PaymentService from "../../services/cart/PaymentService.ts";
import {formatPrice} from "../../utils/formatUtils.tsx";

const { Title, Text } = Typography;

const CheckoutSuccessPage: React.FC = () => {
    const { userInfo: currentUser } = useUserContext();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status');
    const orderCode = searchParams.get('orderCode') || sessionStorage.getItem('lastOrderCode');

    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<any>(null);
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
        navigate('/orders');
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
            <div className="container" style={{ marginTop: '150px' }}>
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
        <div className="container" style={{ marginTop: '150px' }}>
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <th style={{ textAlign: 'left', padding: '10px' }}>Sản phẩm</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>Số lượng</th>
                        <th style={{ textAlign: 'right', padding: '10px' }}>Đơn giá</th>
                        <th style={{ textAlign: 'right', padding: '10px' }}>Thành tiền</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderDetails.items && orderDetails.items.map((item: any, index: number) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '10px' }}>{item.productName}</td>
                            <td style={{ textAlign: 'center', padding: '10px' }}>{item.quantity}</td>
                            <td style={{ textAlign: 'right', padding: '10px' }}>{formatPrice(item.pricePerUnit)}</td>
                            <td style={{ textAlign: 'right', padding: '10px' }}>{formatPrice(item.pricePerUnit * item.quantity)}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={3} style={{ textAlign: 'right', padding: '10px' }}><strong>Tổng cộng:</strong></td>
                        <td style={{ textAlign: 'right', padding: '10px' }}><strong>{formatPrice(orderDetails.totalAmount)}</strong></td>
                    </tr>
                    </tfoot>
                </table>
            </Card>
        </div>
    );
};

export default CheckoutSuccessPage;
