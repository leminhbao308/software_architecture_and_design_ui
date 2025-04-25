import React, {useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button, Card, Result, Typography} from 'antd';
import {CloseCircleFilled, ShoppingOutlined} from '@ant-design/icons';
import PaymentService from "../../services/cart/PaymentService.ts";
import {getAccessToken} from "../../utils/tokenUtils.ts";

const {Text} = Typography;

const CheckoutCancelPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const status = searchParams.get('status') || 'CANCELLED';
    const code = searchParams.get('code');
    const orderCode = searchParams.get('orderCode') || sessionStorage.getItem('lastOrderCode');

    const token = getAccessToken()

    useEffect(() => {
        const updatePaymentStatus = async () => {
            try {
                if (!orderCode) {
                    console.log("Order code not found!")
                    return;
                }

                if (status === "CANCELLED")
                    await PaymentService.updateOrderStatus(token, orderCode, false);
            } catch (err) {
                console.error('Failed to update order status:', err);
            }
        };

        updatePaymentStatus();
    }, [orderId]);

    // Clean up sessionStorage
    sessionStorage.removeItem('lastOrderCode');

    const handleContinueShopping = () => {
        navigate('/');
    };

    return (
        <div className="container" style={{marginTop: '100px'}}>
            <Card>
                <Result
                    icon={<CloseCircleFilled style={{color: '#ff4d4f'}}/>}
                    status="error"
                    title="Thanh toán đã bị hủy"
                    subTitle={
                        <div>
                            <p>Đơn hàng của bạn đã bị hủy hoặc gặp sự cố trong quá trình thanh toán.</p>
                            {orderId && <p>Mã đơn hàng: <Text code>{orderCode}</Text></p>}
                            {status && <p>Trạng thái: <Text code>{status === "CANCELLED" ? "Đã hủy giao dịch" : "Có lỗi xảy ra"}</Text></p>}
                            {code && code != "00" && <p>Mã lỗi: <Text code>{code}</Text></p>}
                        </div>
                    }
                    extra={[
                        <Button
                            key="buy"
                            icon={<ShoppingOutlined/>}
                            onClick={handleContinueShopping}
                        >
                            Tiếp tục mua sắm
                        </Button>
                    ]}
                />
            </Card>
        </div>
    );
};

export default CheckoutCancelPage;
