import {Button, Card, Divider, Flex, Typography} from 'antd';
import React, {MouseEventHandler} from "react";


const {Title} = Typography;

interface CardContainerCoreProps {
    title?: string,
    children: React.ReactNode,
    style?: React.CSSProperties,
    className?: string,
    bodyStyle?: React.CSSProperties,
    titleStyle?: React.CSSProperties,
    buttonStyle?: React.CSSProperties,
    button?: {
        show: boolean,
        type?: "link" | "text" | "default" | "primary" | "dashed",
        title: string,
        disabled?: boolean,
        onClick?: MouseEventHandler
    }
}

const CardContainerCore: React.FC<CardContainerCoreProps> = (
    {
        title,
        children,
        style = {},
        className,
        bodyStyle = {padding: 20},
        titleStyle = {},
        buttonStyle = {},
        button = {
            show: false,
            title: "Button",
            type: "text",
            disabled: false,
            onClick: () => {}
        }
    }
) => {
    const _renderChildren = () => {
        return (
            <div style={{display: 'block', ...bodyStyle}}>
                {children}
            </div>
        );
    };

    return (
        <Card
            hoverable
            style={{
                width: '100%',
                borderRadius: 5,
                overflow: 'hidden',
                cursor: "default",
                ...style,
            }}
            className={`${className} custom-card-hover`}
        >
            <div>
                {title &&
                    <Flex justify={button.show ? "space-between" : "flex-start"} align={"center"} >
                        <Title level={2} style={{...titleStyle}}
                        >
                            {title}
                        </Title>
                        {button.show &&
                            <Button
                                size={"large"}
                                type={button.type ? button.type : "default"}
                                style={{...buttonStyle}}
                                onClick={button.onClick}
                                disabled={button.disabled}
                            >{button.title}</Button>}
                    </Flex>

                }
                {title && <Divider style={{marginTop: "0px", marginBottom: "5px"}}/>}
                {_renderChildren()}
            </div>
        </Card>
    );
}

export default CardContainerCore;
