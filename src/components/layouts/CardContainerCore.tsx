import {Button, Card, Divider, Flex} from 'antd';
import {Typography} from "antd";
import React, {MouseEventHandler} from "react";


const {Title} = Typography;

interface CardContainerCoreProps {
    title?: string,
    children: React.ReactNode,
    style?: React.CSSProperties,
    className?: string,
    bodyStyle?: React.CSSProperties,
    titleStyle?: React.CSSProperties,
    button: {
        show: boolean,
        title: string,
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
        button = {
            show: false,
            title: "Button",
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
                    <Flex justify={button.show ? "space-between" : "flex-start"} align={"top"}>
                        <Title level={2} style={titleStyle}
                        >
                            {title}
                        </Title>
                        {button.show &&
                            <Button
                                size={"large"}
                                type={"text"}
                                style={{color: "gray", border: "1px solid gray"}}
                                onClick={button.onClick}
                            >{button.title}</Button>}
                    </Flex>

                }
                <Divider style={{marginTop: "0px",marginBottom: "5px"}}/>
                {_renderChildren()}
            </div>
        </Card>
    );
}

export default CardContainerCore;
