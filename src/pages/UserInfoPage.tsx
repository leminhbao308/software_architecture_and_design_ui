import {Layout, Card, Tabs, Statistic, Row, Col, Avatar, Typography, message, Descriptions} from 'antd';
import {UserOutlined, ShoppingOutlined, HistoryOutlined, InfoCircleOutlined} from '@ant-design/icons';
import CardContainerCore from "../components/layouts/CardContainerCore.tsx";
import useUserContext from "../hooks/useUserContext.ts";
import {useEffect} from "react";
import UserService from "../services/user/UserService.ts";
import {UserType} from "../types/UserType.ts";
import type {DescriptionsProps} from 'antd';

const {Content} = Layout;
const {Title} = Typography;

const UserInfoPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const {userInfo, setUserInfo} = useUserContext();

    const accessToken: string | null =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

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

        fetchUserInfo().then((data: UserType) => {
            setUserInfo(data);
        });
    }, [accessToken, setUserInfo]);

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
        },
        {
            key: 'updates',
            label: (
                <span>
                    <InfoCircleOutlined style={{paddingRight: "5px"}}/>
                    Cập Nhật
                </span>
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
        },
        {
            key: 'cart',
            label: (
                <span>
                    <ShoppingOutlined style={{paddingRight: "5px"}}/>
                    Giỏ Hàng
                </span>
            ),
        },
    ];

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
                                <Statistic title="Đơn hàng" value={11}/>
                            </Col>

                            <Col span={8}>
                                <Statistic title="Tổng tiền tích lũy" value={14} suffix="M"/>
                            </Col>
                        </Row>
                    </Card>

                    {/* Navigation Tabs */}
                    <CardContainerCore>
                        <Tabs
                            defaultActiveKey="info"
                            items={tabItems}
                            centered
                        />

                        {/* Account Information using Descriptions */}
                        <CardContainerCore
                            title={"Thông Tin Tài Khoản"}
                        >
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
                    </CardContainerCore>
                </Content>
            </Layout>
        </div>
    );
};

export default UserInfoPage;
