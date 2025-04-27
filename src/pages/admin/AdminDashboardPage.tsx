import React, {useState} from 'react';
import {
    Layout,
    Menu,
    Card,
    Row,
    Col,
    Typography,
    Table,
    Badge,
    Space,
    Statistic,
    Avatar,
    Input,
    Dropdown,
    Button
} from 'antd';
import {
    DashboardOutlined,
    ShoppingOutlined,
    AppstoreOutlined,
    OrderedListOutlined,
    CreditCardOutlined,
    BellOutlined,
    UserOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';
import {Line, Pie, Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {PresetStatusColorTypes} from "antd/es/_util/colors";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const {Header, Sider, Content} = Layout;
const {Title: AntTitle, Text} = Typography;
const {Search} = Input;

const AdminDashboardPage: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    // Sample data for charts
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12000, 15000, 13000, 18000, 16000, 21000],
                fill: false,
                borderColor: '#4a6cf7',
                tension: 0.1,
            },
        ],
    };

    const orderStatusData = {
        labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
        datasets: [
            {
                data: [45, 25, 20, 10],
                backgroundColor: ['#4a6cf7', '#4caf50', '#ff9800', '#f44336'],
                hoverBackgroundColor: ['#3f51b5', '#2e7d32', '#e65100', '#c62828'],
            },
        ],
    };

    const productCategoryData = {
        labels: ['Electronics', 'Clothing', 'Home', 'Books', 'Others'],
        datasets: [
            {
                label: 'Products by Category',
                data: [120, 95, 73, 45, 23],
                backgroundColor: [
                    '#4a6cf7',
                    '#4caf50',
                    '#ff9800',
                    '#f44336',
                    '#9c27b0',
                ],
            },
        ],
    };

    // Sample data for recent orders table
    const recentOrdersColumns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                if (status === 'Completed')
                    return <Badge status={PresetStatusColorTypes[0]} text={status}/>;
                else if (status === 'Processing')
                    return <Badge status={PresetStatusColorTypes[1]} text={status}/>;
                else if (status === 'Pending')
                    return <Badge status={PresetStatusColorTypes[4]} text={status}/>;
                else if (status === 'Cancelled')
                    return <Badge status={PresetStatusColorTypes[2]} text={status}/>;

                return <Badge status={PresetStatusColorTypes[3]} text={status}/>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    const recentOrdersData = [
        {
            key: '1',
            id: '#12345',
            customer: 'John Doe',
            amount: '$230.00',
            status: 'Completed',
            date: '2025-04-25',
        },
        {
            key: '2',
            id: '#12346',
            customer: 'Jane Smith',
            amount: '$185.00',
            status: 'Processing',
            date: '2025-04-25',
        },
        {
            key: '3',
            id: '#12347',
            customer: 'Bob Johnson',
            amount: '$320.00',
            status: 'Pending',
            date: '2025-04-24',
        },
        {
            key: '4',
            id: '#12348',
            customer: 'Alice Brown',
            amount: '$150.00',
            status: 'Cancelled',
            date: '2025-04-24',
        },
    ];

    // Sample data for top products
    const topProductsColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
    ];

    const topProductsData = [
        {
            key: '1',
            name: 'Product A',
            sales: 124,
            price: '$99.00',
        },
        {
            key: '2',
            name: 'Product B',
            sales: 98,
            price: '$149.00',
        },
        {
            key: '3',
            name: 'Product C',
            sales: 76,
            price: '$79.00',
        },
    ];

    return (
        <Layout style={{minHeight: '100vh'}}>
            {/* Sidebar */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="light"
                style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                }}
            >
                <div style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#4a6cf7',
                    color: 'white',
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                }}>
                    {!collapsed ? 'ADMIN PANEL' : 'AP'}
                </div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined/>,
                            label: 'Dashboard',
                        },
                        {
                            key: '2',
                            icon: <ShoppingOutlined/>,
                            label: 'Products',
                        },
                        {
                            key: '3',
                            icon: <OrderedListOutlined/>,
                            label: 'Orders',
                        },
                        {
                            key: '4',
                            icon: <AppstoreOutlined/>,
                            label: 'Categories',
                        },
                        {
                            key: '5',
                            icon: <CreditCardOutlined/>,
                            label: 'Payments',
                        },
                    ]}
                />

                {/* Services Status */}
                <div style={{padding: '20px 24px', marginTop: '40px'}}>
                    <Text strong style={{display: 'block', marginBottom: '10px'}}>
                        Services Status
                    </Text>
                    <Space direction="vertical" style={{width: '100%'}}>
                        <Space>
                            <Badge status="success"/>
                            <Text>Product Service</Text>
                        </Space>
                        <Space>
                            <Badge status="success"/>
                            <Text>Order Service</Text>
                        </Space>
                        <Space>
                            <Badge status="success"/>
                            <Text>Payment Service</Text>
                        </Space>
                    </Space>
                </div>
            </Sider>

            <Layout>
                {/* Header */}
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{fontSize: '18px', fontWeight: 'bold'}}>
                        Dashboard
                    </div>
                    <Space size="large">
                        <Search placeholder="Search..." style={{width: 200, display: "flex"}}/>

                        <Badge count={5}>
                            <Button type="text" icon={<BellOutlined/>}/>
                        </Badge>
                        <Dropdown menu={{items: []}} placement="bottomRight">
                            <Avatar icon={<UserOutlined/>}/>
                        </Dropdown>
                    </Space>

                </Header>

                {/* Content */}
                <Content style={{margin: '24px 16px', padding: 24, background: '#f5f7fa', overflow: 'auto'}}>
                    {/* Overview Cards */}
                    <AntTitle level={4}>Dashboard Overview</AntTitle>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Total Orders"
                                    value={128}
                                    prefix={<ShoppingOutlined/>}
                                    suffix={
                                        <Text type="success" style={{fontSize: '14px'}}>
                                            <ArrowUpOutlined/> 12%
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Revenue"
                                    value={8240}
                                    precision={2}
                                    prefix="$"
                                    suffix={
                                        <Text type="success" style={{fontSize: '14px'}}>
                                            <ArrowUpOutlined/> 8%
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Products"
                                    value={456}
                                    prefix={<AppstoreOutlined/>}
                                    suffix={
                                        <Text type="secondary" style={{fontSize: '14px'}}>
                                            142 out of stock
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Categories"
                                    value={32}
                                    prefix={<AppstoreOutlined/>}
                                    suffix={
                                        <Text type="secondary" style={{fontSize: '14px'}}>
                                            5 main categories
                                        </Text>
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Charts Section */}
                    <Row gutter={[16, 16]} style={{marginTop: '16px'}}>
                        {/* Revenue Trend Chart */}
                        <Col xs={24} lg={16}>
                            <Card title="Revenue Trends">
                                <Line
                                    data={revenueData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top' as const,
                                            },
                                            title: {
                                                display: false,
                                            },
                                        },
                                    }}
                                />
                            </Card>
                        </Col>

                        {/* Order Status Pie Chart */}
                        <Col xs={24} lg={8}>
                            <Card title="Order Status" style={{height: "100%"}}>
                                <Pie
                                    data={orderStatusData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'bottom' as const,
                                            },
                                        },
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Tables Section */}
                    <Row gutter={[16, 16]} style={{marginTop: '16px'}}>
                        {/* Recent Orders Table */}
                        <Col xs={24} lg={16}>
                            <Card title="Recent Orders" extra={<a href="#">View All</a>}>
                                <Table
                                    columns={recentOrdersColumns}
                                    dataSource={recentOrdersData}
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>

                        {/* Top Products Table */}
                        <Col xs={24} lg={8}>
                            <Card title="Top Products" extra={<a href="#">View All</a>} style={{height: "100%"}}>
                                <Table
                                    columns={topProductsColumns}
                                    dataSource={topProductsData}
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Additional Charts - Can be shown on category/product pages */}
                    <Row gutter={[16, 16]} style={{marginTop: '16px'}}>
                        <Col xs={24}>
                            <Card title="Products by Category">
                                <Bar
                                    data={productCategoryData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false,
                                            },
                                        },
                                    }}
                                    height={100}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboardPage;
