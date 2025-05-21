import React from "react";
import {
    Button,
    Empty,
    Modal,
    Spin,
    Table,
    Typography
} from "antd";
import {PriceHistoryType, ProductType, QuantityHistoryType} from "../../types/ProductType.ts";

const {Text} = Typography;

interface PriceHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    product: ProductType | null;
    priceHistory: PriceHistoryType[];
    loading: boolean;
}

interface QuantityHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    product: ProductType | null;
    quantityHistory: QuantityHistoryType[];
    loading: boolean;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
                                                                        visible,
                                                                        onClose,
                                                                        product,
                                                                        priceHistory,
                                                                        loading
                                                                    }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    return (
        <Modal
            title={`Lịch Sử Giá - ${product?.name}`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            width={1400}
        >
            {product && (
                <div>
                    <div style={{marginBottom: 16}}>
                        <Text strong>Giá Hiện Tại: </Text>
                        <Text>{formatPrice(product.currentPrice)}</Text>
                    </div>

                    {loading ? (
                        <div style={{textAlign: "center", padding: "20px 0"}}>
                            <Spin/>
                        </div>
                    ) : priceHistory && priceHistory.length > 0 ? (
                        <Table
                            dataSource={priceHistory}
                            rowKey={(record) => `${record.timestamp}`}
                            pagination={false}
                            columns={[
                                {
                                    title: "Ngày",
                                    dataIndex: "timestamp",
                                    key: "timestamp",
                                    render: (timestamp: string) =>
                                        new Date(timestamp).toLocaleString(),
                                },
                                {
                                    title: "Giá Cũ",
                                    dataIndex: "oldPrice",
                                    key: "oldPrice",
                                    render: (price: number) => formatPrice(price),
                                },
                                {
                                    title: "Giá Mới",
                                    dataIndex: "newPrice",
                                    key: "newPrice",
                                    render: (price: number) => formatPrice(price),
                                },
                                {
                                    title: "Lý Do",
                                    dataIndex: "changeReason",
                                    key: "changeReason",
                                },
                                {
                                    title: "Người Thay Đổi",
                                    dataIndex: "changedBy",
                                    key: "changedBy",
                                },
                            ]}
                        />
                    ) : (
                        <Empty description="Không có lịch sử giá"/>
                    )}
                </div>
            )}
        </Modal>
    );
};

export const QuantityHistoryModal: React.FC<QuantityHistoryModalProps> = ({
                                                                              visible,
                                                                              onClose,
                                                                              product,
                                                                              quantityHistory,
                                                                              loading
                                                                          }) => {
    return (
        <Modal
            title={`Lịch Sử Tồn Kho - ${product?.name}`}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            width={1400}
        >
            {product && (
                <div>
                    <div style={{marginBottom: 16}}>
                        <Text strong>Số Lượng Hiện Tại: </Text>
                        <Text>{product.totalQuantity}</Text>
                    </div>

                    {loading ? (
                        <div style={{textAlign: "center", padding: "20px 0"}}>
                            <Spin/>
                        </div>
                    ) : quantityHistory && quantityHistory.length > 0 ? (
                        <Table
                            dataSource={quantityHistory}
                            rowKey={(record) => `${record.timestamp}`}
                            pagination={false}
                            columns={[
                                {
                                    title: "Ngày",
                                    dataIndex: "timestamp",
                                    key: "timestamp",
                                    render: (timestamp: string) =>
                                        new Date(timestamp).toLocaleString(),
                                },
                                {
                                    title: "Số Lượng Cũ",
                                    dataIndex: "oldQuantity",
                                    key: "oldQuantity",
                                },
                                {
                                    title: "Số Lượng Mới",
                                    dataIndex: "newQuantity",
                                    key: "newQuantity",
                                },
                                {
                                    title: "Lý Do",
                                    dataIndex: "changeReason",
                                    key: "changeReason",
                                },
                                {
                                    title: "Người Thay Đổi",
                                    dataIndex: "changedBy",
                                    key: "changedBy",
                                },
                            ]}
                        />
                    ) : (
                        <Empty description="Không có lịch sử tồn kho"/>
                    )}
                </div>
            )}
        </Modal>
    );
};
