import React from "react";
import {Alert, Form, Input, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";

const ImagesTab: React.FC = () => {
    return (
        <>
            <Alert
                message="Tính Năng Tải Lên Hình Ảnh"
                description="Chức năng tải lên hình ảnh sẽ được triển khai trong phiên bản tiếp theo."
                type="info"
                showIcon
                style={{marginBottom: 16}}
            />
            <Form.Item name="thumbnailUrl" label="URL Hình Thu Nhỏ">
                <Input placeholder="Nhập URL hình thu nhỏ"/>
            </Form.Item>
            <Upload
                listType="picture-card"
                fileList={[]}
                beforeUpload={() => false}
            >
                <div>
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Tải lên</div>
                </div>
            </Upload>
        </>
    );
};

export default ImagesTab;
