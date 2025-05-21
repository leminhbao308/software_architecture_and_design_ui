import {ProductType} from "../../types/ProductType.ts";
import React, {Key, memo} from "react";
import {Badge, Empty, Space, Table, Tag} from "antd";
import {DeleteOutlined, DollarOutlined, EditOutlined, InboxOutlined, LoadingOutlined} from "@ant-design/icons";
import {Button, Popconfirm} from "antd";
import {ColumnsType} from "antd/es/table";

interface ProductManagementTableProps {
    productList: ProductType[];
    onEdit?: (product: ProductType) => void;
    onPriceHistory?: (product: ProductType) => void;
    onQuantityHistory?: (product: ProductType) => void;
    onDelete?: (productId: string) => void;
    loading?: boolean;
    actionLoading?: { [key: string]: boolean };
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        showSizeChanger?: boolean;
        pageSizeOptions?: string[];
        showTotal?: (total: number) => string;
        onChange?: (page: number, pageSize: number) => void;
    };
}

// Memoize the component to prevent unnecessary re-renders
const ProductManagementTable: React.FC<ProductManagementTableProps> = memo(({
                                                                                productList,
                                                                                onEdit,
                                                                                onPriceHistory,
                                                                                onQuantityHistory,
                                                                                onDelete,
                                                                                pagination,
                                                                                loading = false,
                                                                                actionLoading = {}
                                                                            }) => {
    // Format price method
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Define table columns outside of render to prevent recreation on each render
    const columns: ColumnsType<ProductType> = [
        {
            title: "Ảnh",
            key: "image",
            width: 80,
            render: (value: null, record: ProductType) => (
                <div
                    style={{
                        width: 60,
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {record.imageUrls && record.imageUrls.length > 0 ? (
                        <img
                            src={record.imageUrls[0]}
                            alt={record.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    ) : record.thumbnailUrl ? (
                        <img
                            src={record.thumbnailUrl}
                            alt={record.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <div style={{color: "#ccc", fontSize: 24}}>
                            <InboxOutlined/>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
            render: (text: string, record: ProductType) => (
                <div>
                    <div style={{fontWeight: "bold"}}>{text}</div>
                    <div style={{fontSize: 12, color: "#999"}}>SKU: {record.sku}</div>
                </div>
            ),
        },
        {
            title: "Hãng",
            dataIndex: "brand",
            key: "brand",
        },
        {
            title: "Giá",
            key: "price",
            render: (value: null, record: ProductType) => (
                <div>
                    <div style={{fontWeight: "bold"}}>
                        {formatPrice(record.currentPrice)}
                    </div>
                    {record.basePrice > record.currentPrice && (
                        <div
                            style={{
                                textDecoration: "line-through",
                                color: "#999",
                                fontSize: 12,
                            }}
                        >
                            {formatPrice(record.basePrice)}
                        </div>
                    )}
                </div>
            ),
            sorter: (a: ProductType, b: ProductType) => a.currentPrice - b.currentPrice,
        },
        {
            title: "Số Lượng",
            key: "quantity",
            render: (value: null, record: ProductType) => (
                <div>
                    <Badge
                        count={record.availableQuantity}
                        showZero
                        style={{
                            backgroundColor:
                                record.availableQuantity > 10
                                    ? "#52c41a"
                                    : record.availableQuantity > 0
                                        ? "#faad14"
                                        : "#f5222d",
                        }}
                    />
                    {record.reservedQuantity > 0 && (
                        <div style={{fontSize: 12, color: "#999", marginTop: 4}}>
                            Đã bán: {record.reservedQuantity}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "default";
                switch (status) {
                    case "ACTIVE":
                        color = "green";
                        break;
                    case "INACTIVE":
                        color = "gray";
                        break;
                    case "OUT_OF_STOCK":
                        color = "red";
                        break;
                    case "DISCONTINUED":
                        color = "purple";
                        break;
                }
                return <Tag color={color}>{status}</Tag>;
            },
            filters: [
                {text: 'Active', value: 'ACTIVE'},
                {text: 'Inactive', value: 'INACTIVE'},
                {text: 'Out of Stock', value: 'OUT_OF_STOCK'},
                {text: 'Discontinued', value: 'DISCONTINUED'},
            ],
            onFilter: (value: boolean | Key, record: ProductType) => record.status === value,
        },
        {
            title: "Hành Động",
            key: "actions",
            width: 330,
            render: (value: null, record: ProductType) => {
                const isDeleting = actionLoading[record.productId];

                return (
                    <Space>
                        <Button
                            icon={<EditOutlined/>}
                            onClick={() => onEdit && onEdit(record)}
                            disabled={isDeleting}
                        >
                            Sửa
                        </Button>
                        <Button
                            icon={<DollarOutlined/>}
                            onClick={() => onPriceHistory && onPriceHistory(record)}
                            disabled={isDeleting}
                        >
                            Giá
                        </Button>
                        <Button
                            icon={<InboxOutlined/>}
                            onClick={() => onQuantityHistory && onQuantityHistory(record)}
                            disabled={isDeleting}
                        >
                            Tồn Kho
                        </Button>
                        <Popconfirm
                            title="Bạn có muốn xóa sản phẩm này?"
                            onConfirm={() => onDelete && onDelete(record.productId)}
                            okText="Xóa"
                            cancelText="Không"
                            placement="topLeft"
                            disabled={isDeleting}
                        >
                            <Button
                                danger
                                icon={isDeleting ? <LoadingOutlined/> : <DeleteOutlined/>}
                                disabled={isDeleting}
                            />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    // Memoize the pagination change handler
    const handlePaginationChange = (page: number, pageSize?: number) => {
        if (pagination && pagination.onChange) {
            pagination.onChange(page, pageSize || pagination.pageSize);
        }
    };

    // Define pagination configuration once
    const paginationConfig = pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: pagination.showSizeChanger || true,
        pageSizeOptions: pagination.pageSizeOptions || ["10", "20", "50", "100"],
        showTotal: pagination.showTotal || ((total) => `Tổng ${total} sản phẩm`),
        onChange: handlePaginationChange,
        showQuickJumper: true,
        position: ['bottomRight', "topRight"],
        responsive: true,
    } : false;

    return (
        <div>
            <Table
                columns={columns}
                dataSource={productList}
                rowKey="productId"
                loading={loading}
                pagination={paginationConfig}
                scroll={{x: true}}
                locale={{
                    emptyText: (
                        <Empty
                            description="Không tìm thấy sản phẩm"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                }}
            />
        </div>
    );
});

export default ProductManagementTable;
