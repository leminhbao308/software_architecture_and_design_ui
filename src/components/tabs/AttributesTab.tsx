import React from "react";
import {Form, Input} from "antd";

const AttributesTab: React.FC = () => {
    return (
        <Form.Item
            name="additionalAttributes"
            label="Thuộc Tính Bổ Sung (Định Dạng JSON)"
        >
            <Input.TextArea
                rows={6}
                placeholder={
                    'Nhập thuộc tính bổ sung theo định dạng JSON: {"color": "red", "size": "M", "material": "cotton"}'
                }
            />
        </Form.Item>
    );
};

export default AttributesTab;
