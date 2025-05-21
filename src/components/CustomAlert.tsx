import React from 'react';
import {WarningOutlined} from "@ant-design/icons"

interface CustomAlertProps {
    message: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message }) => {
    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '20px 28px',
            borderRadius: '8px',
            fontSize: '22px',
            boxShadow: '0 0 10px rgba(0,0,0,0.15)',
            zIndex: 1000
        }}>
            <WarningOutlined/> {message}
        </div>
    );
};

export default CustomAlert;
