import React from "react";
import {Form, Input, Select} from "antd";

const {Option} = Select;

interface GeneralInfoTabProps {
    isEditing: boolean;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({isEditing}) => {
    return (
        <>
            <div style={{display: "flex", gap: 16}}>
                <Form.Item
                    name="name"
                    label="Tên Sản Phẩm"
                    rules={[
                        {required: true, message: "Vui lòng nhập tên sản phẩm"},
                    ]}
                    style={{flex: 3}}
                >
                    <Input placeholder="Nhập tên sản phẩm"/>
                </Form.Item>

                <Form.Item
                    name="sku"
                    label="SKU"
                    rules={[{required: true, message: "Vui lòng nhập mã SKU"}]}
                    style={{flex: 2}}
                >
                    <Input
                        disabled={isEditing}
                        placeholder="Nhập mã SKU"
                    />
                </Form.Item>
            </div>

            <div style={{display: "flex", gap: 16}}>
                <Form.Item
                    name="brand"
                    label="Hãng Sản Xuất"
                    rules={[{required: true, message: "Vui lòng nhập tên hãng sản xuất"}]}
                    style={{flex: 3}}
                >
                    <Input placeholder="Nhập tên hãng sản xuất"/>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng Thái Sản Phẩm"
                    rules={[
                        {required: true, message: "Chọn trạng thái sản phẩm"},
                    ]}
                    style={{flex: 2}}
                >
                    <Select placeholder="Chọn trạng thái" defaultValue="ACTIVE">
                        <Option value="ACTIVE">Đang bán (ACTIVE)</Option>
                        <Option value="INACTIVE">Tạm dừng bán (INACTIVE)</Option>
                        <Option value="OUT_OF_STOCK">
                            Đang hết hàng (OUT OF STOCK)
                        </Option>
                        <Option value="DISCONTINUED">
                            Ngừng kinh doanh (DISCONTINUED)
                        </Option>
                    </Select>
                </Form.Item>
            </div>

            <Form.Item name="description" label="Mô Tả">
                <Input.TextArea
                    showCount
                    maxLength={1024}
                    rows={4}
                    placeholder="Nhập mô tả sản phẩm"
                />
            </Form.Item>
        </>
    );
};

export default GeneralInfoTab;
