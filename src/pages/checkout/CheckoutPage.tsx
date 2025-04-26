import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Input, List, message, Row, Spin, Steps, Typography} from 'antd';
import {ArrowLeftOutlined, CreditCardOutlined, ShoppingCartOutlined, UserOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import useUserContext from "../../hooks/useUserContext.ts";
import {useCart} from "../../hooks/useCartContext.ts";
import PaymentService from "../../services/cart/PaymentService.ts";
import {getAccessToken} from "../../utils/tokenUtils.ts";
import CartItemComponent from "../../components/cart/CartItemComponent.tsx";
import {formatPrice} from "../../utils/formatUtils.tsx";
import {OrderItemType} from "../../types/order/OrderItemType.ts";
import {OrderPayloadType} from "../../types/order/OrderPayloadType.ts";

const {Title, Text} = Typography;
const {Step} = Steps;

interface CheckoutFormValues {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
}

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {userInfo: currentUser} = useUserContext();
    const {cart, loading, clearCart, getCartTotal} = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep,] = useState(1);

    const token = getAccessToken();

    useEffect(() => {
        // Pre-fill form with user data if available
        if (currentUser) {
            form.setFieldsValue({
                customerName: currentUser.name || '',
                customerEmail: currentUser.email || '',
                customerPhone: currentUser.phone || '',
                customerAddress: ''
            });
        }
    }, [currentUser, form]);

    const handleBack = () => {
        navigate('/cart');
    };

    const handleSubmit = async (values: CheckoutFormValues) => {
        if (!cart || Object.keys(cart.items).length === 0) {
            message.error('Giỏ hàng của bạn đang trống');
            return;
        }

        setIsProcessing(true);

        try {
            // Convert cart items to order items
            const orderItems: OrderItemType[] = Object.values(cart.items).map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                pricePerUnit: item.price,
                totalPrice: item.quantity * item.price
            }));

            // Create order request
            const orderRequest: OrderPayloadType = {
                userId: currentUser ? currentUser.sub : "",
                customerName: values.customerName,
                customerEmail: values.customerEmail,
                customerPhone: values.customerPhone,
                customerAddress: values.customerAddress,
                items: orderItems
            };

            // Call payment service to create order and get payment link
            const paymentData = await PaymentService.checkout(token, orderRequest);

            // If successful, clear cart and redirect to payment URL
            if (paymentData && paymentData.paymentUrl) {
                await clearCart();
                // Store orderCode in sessionStorage for later reference
                if (paymentData.orderCode) {
                    sessionStorage.setItem('lastOrderCode', paymentData.orderCode);
                }
                // Redirect to payment gateway
                window.location.href = paymentData.paymentUrl;
            } else {
                message.error('Không thể tạo liên kết thanh toán');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            message.error('Đã xảy ra lỗi trong quá trình thanh toán');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', padding: '40px'}}>
                <Spin size="large"/>
            </div>
        );
    }

    const cartItems = cart ? Object.values(cart.items) : [];
    const cartTotal = getCartTotal();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className="container" style={{marginTop: '100px'}}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Button
                        icon={<ArrowLeftOutlined/>}
                        onClick={handleBack}
                    >
                        Quay lại giỏ hàng
                    </Button>
                </Col>

                <Col span={24}>
                    <Steps current={currentStep} style={{marginBottom: '24px'}}>
                        <Step title="Giỏ hàng" icon={<ShoppingCartOutlined/>}/>
                        <Step title="Thông tin đặt hàng" icon={<UserOutlined/>}/>
                        <Step title="Thanh toán" icon={<CreditCardOutlined/>}/>
                    </Steps>
                </Col>

                <Col xs={24} lg={16}>
                    <Card title="Thông tin đặt hàng">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                customerName: '',
                                customerEmail: '',
                                customerPhone: '',
                                customerAddress: ''
                            }}
                        >
                            <Form.Item
                                name="customerName"
                                label="Họ và tên"
                                rules={[{required: true, message: 'Vui lòng nhập họ tên'}]}
                            >
                                <Input placeholder="Nhập họ và tên"/>
                            </Form.Item>

                            <Form.Item
                                name="customerEmail"
                                label="Email"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập email'},
                                    {type: 'email', message: 'Email không hợp lệ'}
                                ]}
                            >
                                <Input placeholder="Nhập địa chỉ email"/>
                            </Form.Item>

                            <Form.Item
                                name="customerPhone"
                                label="Số điện thoại"
                                rules={[
                                    {required: true, message: 'Vui lòng nhập số điện thoại'},
                                    {pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ'}
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại"/>
                            </Form.Item>

                            <Form.Item
                                name="customerAddress"
                                label="Địa chỉ giao hàng"
                                rules={[{required: true, message: 'Vui lòng nhập địa chỉ giao hàng'}]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Nhập địa chỉ giao hàng đầy đủ"
                                />
                            </Form.Item>
                        </Form>
                    </Card>

                    <Card title="Sản phẩm" style={{marginTop: '20px'}}>
                        <List
                            itemLayout="horizontal"
                            dataSource={cartItems}
                            renderItem={(item) => (
                                <List.Item>
                                    <CartItemComponent
                                        id={item.productId}
                                        name={item.productName}
                                        price={formatPrice(item.price)}
                                        imageUrl={item.productThumbnail || ''}
                                        quantity={item.quantity}
                                        showQuantityControls={false}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card>
                        <Title level={4}>Tổng đơn hàng</Title>
                        <Divider/>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <Text>Số lượng sản phẩm:</Text>
                            <Text>{totalItems}</Text>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <Text>Tạm tính:</Text>
                            <Text>{formatPrice(cartTotal)}</Text>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                            <Text>Phí vận chuyển:</Text>
                            <Text>{formatPrice(0)}</Text>
                        </div>

                        <Divider/>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                            <Text strong>Tổng cộng:</Text>
                            <Title level={4} style={{margin: 0, color: '#ff4d4f'}}>{formatPrice(cartTotal)}</Title>
                        </div>

                        <Button
                            type="primary"
                            block
                            size="large"
                            loading={isProcessing}
                            onClick={() => form.submit()}
                        >
                            Đặt hàng và thanh toán
                        </Button>

                        <div style={{marginTop: '20px', fontSize: '12px', color: '#999'}}>
                            <p>Bằng cách nhấn "Đặt hàng và thanh toán", bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.</p>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CheckoutPage;
