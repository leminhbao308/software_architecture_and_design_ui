import {Badge, Card, Col, Layout, Row, Statistic, Table, Typography} from "antd";
import {AppstoreOutlined, ArrowUpOutlined, ShoppingOutlined} from "@ant-design/icons";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip,} from 'chart.js';
import {Bar, Line, Pie} from "react-chartjs-2";
import React from "react";
import {PresetStatusColorTypes} from "antd/es/_util/colors";
import {useCategoryCount} from "../../hooks/useCategoryCount.ts";

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

const {Content} = Layout
const {Title: AntTitle, Text} = Typography

const DashboardComponent: React.FC = () => {
    // Use the hook directly instead of managing the state separately
    const {mainCategoryCount, totalCategoryCount} = useCategoryCount();

    // Sample data for charts
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Doanh Thu',
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
        <Content style={{margin: '24px 16px', padding: 24, background: '#f5f7fa', overflow: 'auto'}}>
            {/* Overview Cards */}
            <AntTitle level={4}>Tổng Quan</AntTitle>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Số Đơn Hàng Tuần Này"
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
                            title="Doanh Thu Tuần Này"
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
                            title="Tổng Quan Hàng Hóa"
                            value={456}
                            prefix={<AppstoreOutlined/>}
                            suffix={
                                <Text type="warning" style={{fontSize: '14px'}}>
                                    142 sản phẩm hết hàng
                                </Text>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng Quan Danh Mục"
                            value={totalCategoryCount}
                            prefix={<AppstoreOutlined/>}
                            suffix={
                                <Text type="secondary" style={{fontSize: '14px'}}>
                                    {`${mainCategoryCount} danh mục chính`}
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
                    <Card title="Tăng Trưởng Doanh Thu">
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
                    <Card title="Trạng Thái Các Đơn Hàng" style={{height: "100%"}}>
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
                    <Card title="Các Đơn Hàng Gần Đây" extra={<a href="#">Xem Tất Cả</a>}>
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
                    <Card title="Sản Phẩm Bán Nhiều Nhất" extra={<a href="#">Xem Tất Cả</a>} style={{height: "100%"}}>
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
                    <Card title="Sản Phẩm Bán Được Theo Danh Mục">
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
    )
}

export default DashboardComponent
