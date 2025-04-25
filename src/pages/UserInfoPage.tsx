import type {DescriptionsProps} from 'antd';
import {Avatar, Card, Col, Descriptions, Layout, message, Row, Statistic, StatisticProps, Tabs, Typography} from 'antd';
import {HistoryOutlined, InfoCircleOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import CardContainerCore from "../components/layouts/CardContainerCore.tsx";
import useUserContext from "../hooks/useUserContext.ts";
import {useEffect, useState} from "react";
import UserService from "../services/user/UserService.ts";
import {UserType} from "../types/UserType.ts";
import OrderHistoryComponent from "../components/OrderHistoryComponent.tsx";
import {getAccessToken} from "../utils/tokenUtils.ts";
import OrderService from "../services/cart/OrderService.ts";
import CartPage from "./CartPage.tsx";
import {OrderType} from "../types/order/OrderType.ts";
import CountUp from 'react-countup';

const {Content} = Layout;
const {Title} = Typography;

const formatter: StatisticProps['formatter'] = (value:number|string) => (
    <CountUp end={value as number} separator="," />
);

const UserInfoPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const {userId, userInfo, setUserInfo} = useUserContext();
    const [orderCount, setOrderCount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);
    const [activeTab, setActiveTab] = useState('info');

    const accessToken = getAccessToken();



    const sendError = (message: string) => {
        messageApi.open({
            type: 'error',
            content: message,
        });
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const getUserInfo = await UserService.getUserInfo(
                    accessToken ? accessToken : ""
                );

                return getUserInfo.data;
            } catch (error) {
                sendError("Không thể tải thông tin người dùng.");
                console.error(error);
            }
        }

        const fetchOrderStats = async () => {
            try {
                const token = getAccessToken();
                const orders: OrderType[] = await OrderService.getUserOrders(token, userId);

                // Calculate order stats
                setOrderCount(orders.length);

                // Calculate total spent from completed orders
                const totalAmount = orders
                    .filter(order => order.status === 'PAID')
                    .reduce((sum, order) => sum + order.totalAmount, 0);

                setTotalSpent(totalAmount);
            } catch (error) {
                console.error("Failed to fetch order statistics:", error);
            }
        };

        fetchUserInfo().then((data: UserType) => {
            setUserInfo(data);
        });
        fetchOrderStats();
    }, [accessToken, setUserInfo]);

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };


    // User info descriptions items
    const userNameItems: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Username',
            children: userInfo?.preferred_username || '-',
            span: "filled"
        },
        {
            key: '2',
            label: 'Họ',
            children: userInfo?.given_name || '-',
        },
        {
            key: '3',
            label: 'Tên',
            children: userInfo?.family_name || '-',
        }
    ];

    const userInfoItems: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Email',
            children: userInfo?.email || '-',
            span: "filled"
        },
        {
            key: '2',
            label: 'Số điện thoại',
            children: userInfo?.phone || '-',
            span: "filled"
        }
    ];

    // Tabs items
    const tabItems = [
        {
            key: 'info',
            label: (
                <span>
                    <InfoCircleOutlined style={{paddingRight: "5px"}}/>
                    Thông Tin
                </span>
            ),
            children: (
                <CardContainerCore title={"Thông Tin Tài Khoản"}>
                    <Descriptions
                        title={"Họ tên và tên tài khoản"}
                        layout="vertical"
                        bordered
                        items={userNameItems}
                    />

                    <Descriptions
                        title={"Thông tin liên lạc"}
                        layout="vertical"
                        bordered
                        items={userInfoItems}
                        style={{marginTop: "40px"}}
                    />
                </CardContainerCore>
            ),
        },
        {
            key: 'history',
            label: (
                <span>
                    <HistoryOutlined style={{paddingRight: "5px"}}/>
                    Lịch Sử Mua Hàng
                </span>
            ),
            children: <OrderHistoryComponent/>,
        },
        {
            key: 'cart',
            label: (
                <span>
                    <ShoppingOutlined style={{paddingRight: "5px"}}/>
                    Giỏ Hàng
                </span>
            ),
            children: (
                <CartPage marginTop={false}/>
            ),
        },
    ];

    return (
        <div className={"container"} style={{marginTop: "100px"}}>
            {contextHolder}
            <Layout>
                <Content style={{padding: '24px', backgroundColor: '#f0f2f5'}}>
                    {/* User Statistics Card */}
                    <Card style={{marginBottom: '24px'}}>
                        <Row align="middle" gutter={16}>
                            <Col span={2}>
                                <Avatar size={64} icon={<UserOutlined/>}/>
                            </Col>

                            <Col span={6}>
                                <Title level={4}>{userInfo?.name}</Title>
                                <Typography.Text className={"fw-medium fs-5"}>{userInfo?.phone}</Typography.Text>
                            </Col>

                            <Col span={8}>
                                <Statistic title="Đơn hàng" value={orderCount}/>
                            </Col>

                            <Col span={8}>
                                <Statistic
                                    title="Tổng tiền tích lũy"
                                    value={totalSpent} suffix=" VNĐ"
                                    formatter={formatter} />
                            </Col>
                        </Row>
                    </Card>

                    {/* Navigation Tabs */}
                    <CardContainerCore>
                        <Tabs
                            defaultActiveKey="info"
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            items={tabItems}
                            centered
                        />
                    </CardContainerCore>
                </Content>
            </Layout>
        </div>
    );
};

export default UserInfoPage;
