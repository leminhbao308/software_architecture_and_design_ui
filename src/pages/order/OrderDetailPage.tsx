import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Card, Descriptions, Divider, Result, Spin, Steps, Tag, Typography} from 'antd';
import {ArrowLeftOutlined, ShoppingOutlined} from '@ant-design/icons';
import {getAccessToken} from "../../utils/tokenUtils.ts";
import OrderService from "../../services/cart/OrderService.ts";
import {formatPrice} from "../../utils/formatUtils.tsx";
import {OrderType} from "../../types/order/OrderType.ts";
import ProductGrid from "../../components/products/ProductGrid.tsx";

const { Title, Text } = Typography;
const { Step } = Steps;

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [orderDetails, setOrderDetails] = useState<OrderType|null>(null);
    const [error, setError] = useState<string | null>(null);

    const token = getAccessToken();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                if (!orderId) {
                    setError('Không tìm thấy mã đơn hàng');
                    setLoading(false);
                    return;
                }

                const details = await OrderService.getOrderDetails(token, orderId);
                setOrderDetails(details);
                // No need to log orderDetails here as it will still be null due to async state update
            } catch (err) {
                console.error('Failed to fetch order details:', err);
                setError('Không thể tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we're still loading and don't have data or error
        if (loading && !orderDetails && !error) {
            fetchOrderDetails();
        }
    }, [orderId, token, loading, orderDetails, error]);

    const getOrderStatusStep = (status: string) => {
        switch (status) {
            case 'AWAITING_PAYMENT':
                return 0;
            case 'PAID':
                return 1;
            case 'CANCELLED':
                return -1;
            default:
                return 0;
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleCancelOrder = async () => {
        try {
            if (!orderId) return;

            setLoading(true);
            await OrderService.cancelOrder(token, orderId);

            // Reload order details after cancellation
            const details = await OrderService.getOrderDetails(token, orderId);
            setOrderDetails(details);
        } catch (err) {
            setError('Không thể hủy đơn hàng');
        } finally {
            setLoading(false);
        }
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

    const canCancelOrder = orderDetails.status === 'AWAITING_PAYMENT';
    const orderStatus = getOrderStatusStep(orderDetails.status);

    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                style={{ marginBottom: '20px' }}
            >
                Quay lại
            </Button>

            <Card>
                <Title level={3}>Chi tiết đơn hàng #{orderId}</Title>

                {orderStatus >= 0 ? (
                    <Steps
                        current={orderStatus}
                        style={{ marginBottom: '24px' }}
                    >
                        <Step title="Chờ thanh toán" />
                        <Step title="Đã thanh toán" />
                    </Steps>
                ) : (
                    <div style={{ textAlign: 'center', margin: '20px 0', color: '#ff4d4f' }}>
                        <Tag color="error" style={{ padding: '5px 15px', fontSize: '16px' }}>
                            {orderDetails.status === 'CANCELLED' ? 'Đơn hàng đã bị hủy' : 'Thanh toán thất bại'}
                        </Tag>
                    </div>
                )}

                <Divider />

                <Title level={4}>Thông tin đơn hàng</Title>
                <Descriptions bordered column={{ xs: 1, sm: 2 }}>
                    <Descriptions.Item label="Mã đơn hàng">{orderDetails.id}</Descriptions.Item>
                    <Descriptions.Item label="Mã giao dịch thanh toán">{orderDetails.paymentTransactionId || orderDetails.paymentOrderCode}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        {(() => {
                            switch (orderDetails.status) {
                                case 'PAID':
                                    return <Text type="success" strong>Đã thanh toán</Text>;
                                case 'AWAITING_PAYMENT':
                                    return <Text type="warning" strong>Chờ thanh toán</Text>;
                                case 'CANCELLED':
                                    return <Text type="danger" strong>Đã hủy</Text>;
                                default:
                                    return <Text>{orderDetails.status}</Text>;
                            }
                        })()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt hàng">
                        {new Date(orderDetails.createdAt).toLocaleString('vi-VN')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tên khách hàng">{orderDetails.customerName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{orderDetails.customerEmail}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{orderDetails.customerPhone}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{orderDetails.customerAddress}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                        <Text type="danger" strong>{formatPrice(orderDetails.totalAmount)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">{orderDetails.paymentMethod || 'Thanh toán online'}</Descriptions.Item>
                </Descriptions>

                <Divider />

                <Title level={4}>Sản phẩm đã đặt</Title>
                <ProductGrid orderDetails={orderDetails}/>

                <Divider />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button
                        type="primary"
                        icon={<ShoppingOutlined />}
                        onClick={handleContinueShopping}
                    >
                        Tiếp tục mua sắm
                    </Button>

                    {canCancelOrder && (
                        <Button
                            danger
                            onClick={handleCancelOrder}
                        >
                            Hủy đơn hàng
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default OrderDetailPage;
