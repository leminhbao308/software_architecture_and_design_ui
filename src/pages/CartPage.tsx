import React from 'react';
import {Button, Card, Col, Divider, Empty, Input, List, message, Modal, Row, Space, Spin, Typography} from 'antd';
import {ArrowLeftOutlined, DeleteOutlined, ShoppingOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {useCart} from "../hooks/useCartContext.ts";
import CartItemComponent from "../components/cart/CartItemComponent.tsx";
import {formatPrice} from "../utils/formatUtils.tsx";

const {Title, Text} = Typography;

interface CartPageProps {
    marginTop: boolean
}

const CartPage: React.FC<CartPageProps> = ({marginTop = true}) => {
    const navigate = useNavigate();
    const [modal, contextHolder] = Modal.useModal();
    const {cart, loading, error, clearCart, getCartTotal} = useCart();

    const handleClearCart = async () => {
        const confirmed = await modal.confirm({
            title: 'Xác nhận xóa giỏ hàng',
            content: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: {danger: true},
            centered: true
        });

        if (confirmed) {
            try {
                await clearCart();
                message.success('Đã xóa giỏ hàng');
            } catch (error) {
                message.error('Không thể xóa giỏ hàng');
                console.error(error)
            }
        }
    };

    const handleCheckout = () => {
        // Redirect to checkout page
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', padding: '40px'}}>
                <Spin size="large"/>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{textAlign: 'center', padding: '40px'}}>
                <Text type="danger">Có lỗi xảy ra: {error}</Text>
                <br/>
                <Button
                    type="primary"
                    onClick={handleContinueShopping}
                    style={{marginTop: '20px'}}
                >
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    // Check if cart is empty
    const isCartEmpty = !cart || !cart.items || Object.keys(cart.items).length === 0;

    if (isCartEmpty) {
        return (
            <div className={"container"} style={{marginTop: marginTop ? "100px" : "0"}}>
                <Card>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Giỏ hàng của bạn đang trống"
                    >
                        <Button
                            type="primary"
                            icon={<ShoppingOutlined/>}
                            onClick={handleContinueShopping}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    </Empty>
                </Card>
            </div>
        );
    }

    const cartItems = cart ? Object.values(cart.items) : [];
    const cartTotal = getCartTotal();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);


    return (
        <div className={"container"} style={{marginTop: marginTop ? "100px" : "0"}}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Button
                        icon={<ArrowLeftOutlined/>}
                        onClick={handleContinueShopping}
                    >
                        Tiếp tục mua sắm
                    </Button>
                </Col>

                <Col xs={24} lg={16}>
                    <Card>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                            <Title level={4} style={{margin: 0}}>Giỏ hàng của bạn</Title>
                            <Button
                                danger
                                type="text"
                                icon={<DeleteOutlined/>}
                                onClick={handleClearCart}
                            >
                                Xóa tất cả
                            </Button>
                        </div>

                        <List
                            itemLayout="horizontal"
                            dataSource={cartItems}
                            renderItem={(item) => (
                                <List.Item style={{padding: '16px 0'}}>
                                    <CartItemComponent
                                        id={item.productId}
                                        name={item.productName}
                                        price={formatPrice(item.price)}
                                        imageUrl={item.productThumbnail || ''}
                                        quantity={item.quantity}
                                        showQuantityControls={true}
                                        isBigger={true}
                                    />
                                </List.Item>
                            )}
                        />

                        {/*<Divider/>*/}

                        {/*<Title level={5} style={{marginBottom: "10px"}}>Mã giảm giá (nếu có)</Title>*/}
                        {/*<Space.Compact style={{width: '50%', height: "max-content"}}>*/}
                        {/*    <Input placeholder="Nhập mã giảm giá của bạn"/>*/}
                        {/*    <Button type="primary" size={"large"}>Sử dụng</Button>*/}
                        {/*</Space.Compact>*/}
                        {/*<Text style={{marginLeft: "15px"}}>Bạn được giảm {<b>5%</b>} giá trị đơn hàng</Text>*/}
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

                        <Divider/>

                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                            <Text strong>Tổng cộng:</Text>
                            <Title level={4} style={{margin: 0, color: '#ff4d4f'}}>{formatPrice(cartTotal)}</Title>
                        </div>

                        <Button
                            type="primary"
                            block
                            size="large"
                            onClick={handleCheckout}
                            disabled={isCartEmpty}
                        >
                            Thanh toán
                        </Button>
                    </Card>
                </Col>
            </Row>
            {contextHolder}
        </div>
    );
};

export default CartPage;
