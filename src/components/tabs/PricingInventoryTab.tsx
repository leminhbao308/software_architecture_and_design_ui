import React, {useState, useEffect} from "react";
import {Form, InputNumber, Button, Tooltip, Space} from "antd";
import {FormInstance} from "antd/lib/form";
import {InfoCircleOutlined, CiCircleOutlined} from "@ant-design/icons";
import useProductForm from "../../hooks/useProductForm";
import {formatPrice, parsePrice} from "../../utils/formatCurrency";

interface PricingInventoryTabProps {
    form: FormInstance;
}

const PricingInventoryTab: React.FC<PricingInventoryTabProps> = ({form}) => {
    // Add states to track focus status for price inputs
    const [costPriceFocused, setCostPriceFocused] = useState<boolean>(false);
    const [basePriceFocused, setBasePriceFocused] = useState<boolean>(false);
    const [currentPriceFocused, setCurrentPriceFocused] = useState<boolean>(false);

    // State to hold calculated percentages
    const [profitPercentage, setProfitPercentage] = useState<number>(0);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);

    // State to track form values for UI updates
    const [formValues, setFormValues] = useState({
        costPrice: 0,
        basePrice: 0,
        currentPrice: 0,
        availableQuantity: 0,
        reservedQuantity: 0,
        totalQuantity: 0
    });

    // Use the product form hook for shared logic
    const {
        handleCostPriceChange,
        handleBasePriceChange,
        handleCurrentPriceChange,
        handleQuantityChange,
        calculateProfitPercentage,
        calculateDiscountPercentage,
        calculateBasePrice,
        calculateCurrentPrice,
        roundToThousand
    } = useProductForm(form);

    // Update percentages when price values change
    useEffect(() => {
        // Get latest form values directly from the form
        const values = form.getFieldsValue();
        if (values && (values.costPrice || values.basePrice || values.currentPrice)) {
            updatePercentages();
        }
    }, [formValues]);

    // Function to update percentages when values change
    const updatePercentages = () => {
        const values = form.getFieldsValue();
        if (values.costPrice && values.basePrice) {
            const calculatedProfit = calculateProfitPercentage(values.costPrice, values.basePrice);
            setProfitPercentage(calculatedProfit);
            form.setFieldsValue({profitPercentage: calculatedProfit});
        }

        if (values.basePrice && values.currentPrice) {
            const calculatedDiscount = calculateDiscountPercentage(values.basePrice, values.currentPrice);
            setDiscountPercentage(calculatedDiscount);
            form.setFieldsValue({discountPercentage: calculatedDiscount});
        }
    };

    // Calculate cost price from current price (reverse calculation)
    const calculateCostPriceFromCurrentPrice = (currentPrice: number): number => {
        // Cost price should be at most current price / 1.2 to maintain minimum 20% profit
        return Math.floor(currentPrice / 1.2);
    };

    // Enhanced field change handlers with auto-updating
    const handleCostPriceChangeEnhanced = (value: number) => {
        if (!value || value <= 0) return;

        // Handle cost price change to calculate base price and current price
        handleCostPriceChange(value);

        // After handleCostPriceChange has updated the form, update local state
        setTimeout(() => {
            refreshFormValues();
        }, 0);
    };

    const handleBasePriceChangeEnhanced = (value: number) => {
        if (!value || value <= 0) return;

        const costPrice = formValues.costPrice;

        // If there's no cost price yet, calculate backward
        if (costPrice <= 0) {
            // Calculate cost price from base price assuming 20% profit
            const calculatedCostPrice = Math.floor(value / 1.2);
            form.setFieldsValue({costPrice: calculatedCostPrice});

            // Now call the cost price handler which will update all other values
            handleCostPriceChangeEnhanced(calculatedCostPrice);
            return;
        }

        // Normal flow - Handle base price change
        handleBasePriceChange(value);

        // Update local state after form update
        setTimeout(() => {
            refreshFormValues();
        }, 0);
    };

    const handleCurrentPriceChangeEnhanced = (value: number) => {
        if (!value || value <= 0) return;

        const costPrice = formValues.costPrice;
        const basePrice = formValues.basePrice;

        // If we don't have any other prices yet, calculate them backward
        if (costPrice <= 0 && basePrice <= 0) {
            // Calculate cost price maintaining minimum 20% profit
            const calculatedCostPrice = calculateCostPriceFromCurrentPrice(value);

            // Calculate base price - set it equal to current price for 0% discount initially
            const calculatedBasePrice = value;

            // Set the calculated values
            form.setFieldsValue({
                costPrice: calculatedCostPrice,
                basePrice: calculatedBasePrice
            });

            // Update local state after form update
            setTimeout(() => {
                refreshFormValues();
            }, 0);

            return;
        }
        // If we have cost price but no base price
        else if (costPrice > 0 && basePrice <= 0) {
            // Set base price equal to current price (0% discount)
            form.setFieldsValue({basePrice: value});

            // Check if current price satisfies minimum profit requirement
            const minCurrentPrice = costPrice * 1.2;
            if (value < minCurrentPrice) {
                // Adjust current price to maintain minimum profit
                form.setFieldsValue({currentPrice: Math.ceil(minCurrentPrice)});
            }
        }
        // If current price is greater than base price, update base price
        else if (value > basePrice) {
            // Set base price equal to current price (0% discount)
            form.setFieldsValue({basePrice: value});

            // Check if this new base price maintains proper profit margin from cost price
            const minBasePrice = (costPrice || 0) * 1.2;
            if (value < minBasePrice) {
                // If not, adjust cost price downward to maintain minimum 20% profit
                const newCostPrice = Math.floor(value / 1.2);
                form.setFieldsValue({costPrice: newCostPrice});

                // Update the state after making these changes
                setTimeout(() => {
                    refreshFormValues();
                    updatePercentages();
                }, 0);
            }
        }

        // Normal flow - Handle current price change
        handleCurrentPriceChange(value);

        // Update local state after form update
        setTimeout(() => {
            refreshFormValues();
        }, 0);
    };

    // Enhanced quantity change handler
    const handleQuantityChangeEnhanced = (fieldName: string, value: number) => {
        handleQuantityChange(fieldName, value);

        // Update local state after form update
        setTimeout(() => {
            refreshFormValues();
        }, 0);
    };

    // Round price to nearest thousand
    const handleRoundPrice = (fieldName: string) => {
        const currentValue = form.getFieldValue(fieldName);
        if (currentValue) {
            const roundedValue = roundToThousand(currentValue);
            form.setFieldsValue({[fieldName]: roundedValue});

            // Trigger appropriate handler to update other fields
            if (fieldName === 'costPrice') {
                handleCostPriceChangeEnhanced(roundedValue);
            } else if (fieldName === 'basePrice') {
                handleBasePriceChangeEnhanced(roundedValue);
            } else if (fieldName === 'currentPrice') {
                handleCurrentPriceChangeEnhanced(roundedValue);
            }
        }
    };

    // Function to synchronize all fields based on current values
    const syncAllFields = () => {
        // Refresh local state with current form values
        refreshFormValues();

        const costPrice = formValues.costPrice;
        const basePrice = formValues.basePrice;
        const currentPrice = formValues.currentPrice;

        // Check if current price is greater than base price and fix it
        if (currentPrice > basePrice && basePrice > 0) {
            form.setFieldsValue({basePrice: currentPrice});
            setTimeout(() => {
                refreshFormValues();
                updatePercentages();
            }, 0);
        }

        // Case 1: We have current price but no other prices
        if (currentPrice > 0 && costPrice <= 0 && basePrice <= 0) {
            handleCurrentPriceChangeEnhanced(currentPrice);
        }
        // Case 2: We have base price but no cost price
        else if (basePrice > 0 && costPrice <= 0) {
            handleBasePriceChangeEnhanced(basePrice);
        }
        // Case 3: We have cost price (standard case)
        else if (costPrice > 0) {
            handleCostPriceChangeEnhanced(costPrice);
        }

        // Update local state again after calculations
        setTimeout(() => {
            refreshFormValues();
        }, 10);
    };

    // Watch for form field changes and update local state
    useEffect(() => {
        // Initial sync on mount
        setTimeout(() => {
            syncAllFields();
        }, 100);
    }, []);

    // Update the formValues whenever form fields change
    const refreshFormValues = () => {
        const values = form.getFieldsValue();
        setFormValues({
            costPrice: values.costPrice || 0,
            basePrice: values.basePrice || 0,
            currentPrice: values.currentPrice || 0,
            availableQuantity: values.availableQuantity || 0,
            reservedQuantity: values.reservedQuantity || 0,
            totalQuantity: values.totalQuantity || 0
        });
    };

    return (
        <>
            {/* Cost Price (Giá Nhập Hàng) */}
            <Form.Item
                name="costPrice"
                label={
                    <span>
                        Giá Nhập Hàng{" "}
                        <Tooltip title="Giá nhập hàng từ nhà cung cấp">
                            <InfoCircleOutlined style={{color: "#1890ff"}}/>
                        </Tooltip>
                    </span>
                }
                rules={[
                    {required: true, message: "Vui lòng nhập giá nhập hàng"},
                ]}
            >
                <Space.Compact style={{width: '100%'}}>
                    <InputNumber
                        min={0}
                        style={{width: "100%"}}
                        formatter={(value) => costPriceFocused ? value : formatPrice(value)}
                        parser={(value) => parsePrice(value)}
                        onChange={(value) => handleCostPriceChangeEnhanced(Number(value))}
                        onFocus={() => setCostPriceFocused(true)}
                        onBlur={() => {
                            setCostPriceFocused(false);
                            syncAllFields();
                        }}
                        placeholder="Nhập giá nhập hàng"
                        value={formValues.costPrice}
                    />
                    <Button
                        icon={<CiCircleOutlined/>}
                        title="Làm Tròn"
                        onClick={() => handleRoundPrice('costPrice')}
                    />
                </Space.Compact>
            </Form.Item>

            {/* Profit Percentage Section */}
            <div style={{display: "flex", gap: 16, marginBottom: 16}}>
                <Form.Item
                    name="profitPercentage"
                    label={
                        <span>
                            Lợi Nhuận{" "}
                            <Tooltip title="Tối thiểu 20%">
                                <InfoCircleOutlined style={{color: "#1890ff"}}/>
                            </Tooltip>
                        </span>
                    }
                    style={{flex: 1}}
                >
                    <InputNumber
                        disabled
                        min={0}
                        style={{width: "100%"}}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value!.replace('%', '')}
                        value={profitPercentage}
                    />
                </Form.Item>

                {/* Base Price (Giá Gốc) */}
                <Form.Item
                    name="basePrice"
                    label={
                        <span>
                            Giá Gốc{" "}
                            <Tooltip title="Giá gốc = Giá nhập hàng + Lợi nhuận">
                                <InfoCircleOutlined style={{color: "#1890ff"}}/>
                            </Tooltip>
                        </span>
                    }
                    rules={[{required: true, message: "Vui lòng nhập giá gốc"}]}
                    style={{flex: 1}}
                >
                    <Space.Compact style={{width: '100%'}}>
                        <InputNumber
                            min={0}
                            style={{width: "100%"}}
                            formatter={(value) => basePriceFocused ? value : formatPrice(value)}
                            parser={(value) => parsePrice(value)}
                            onChange={(value) => handleBasePriceChangeEnhanced(Number(value))}
                            onFocus={() => setBasePriceFocused(true)}
                            onBlur={() => {
                                setBasePriceFocused(false);
                                syncAllFields();
                            }}
                            placeholder="Nhập giá gốc"
                            value={formValues.basePrice}
                        />
                        <Button
                            icon={<CiCircleOutlined/>}
                            title="Làm Tròn"
                            onClick={() => handleRoundPrice('basePrice')}
                        />
                    </Space.Compact>
                </Form.Item>
            </div>

            {/* Discount Percentage Section */}
            <div style={{display: "flex", gap: 16, marginBottom: 16}}>
                <Form.Item
                    name="discountPercentage"
                    label={
                        <span>
                            Giảm Giá{" "}
                            <Tooltip title="Tối đa 99%">
                                <InfoCircleOutlined style={{color: "#1890ff"}}/>
                            </Tooltip>
                        </span>
                    }
                    style={{flex: 1}}
                >
                    <InputNumber
                        disabled
                        min={0}
                        style={{width: "100%"}}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value!.replace('%', '')}
                        value={discountPercentage}
                    />
                </Form.Item>

                {/* Current Price (Giá Hiện Bán) */}
                <Form.Item
                    name="currentPrice"
                    label={
                        <span>
                            Giá Hiện Bán{" "}
                            <Tooltip title="Giá bán hiện tại = Giá gốc - Giảm giá">
                                <InfoCircleOutlined style={{color: "#1890ff"}}/>
                            </Tooltip>
                        </span>
                    }
                    rules={[
                        {required: true, message: "Vui lòng nhập giá hiện bán"},
                    ]}
                    style={{flex: 1}}
                >
                    <Space.Compact style={{width: '100%'}}>
                        <InputNumber
                            min={0}
                            style={{width: "100%"}}
                            formatter={(value) => currentPriceFocused ? value : formatPrice(value)}
                            parser={(value) => parsePrice(value)}
                            onChange={(value) => handleCurrentPriceChangeEnhanced(Number(value))}
                            onFocus={() => setCurrentPriceFocused(true)}
                            onBlur={() => {
                                setCurrentPriceFocused(false);
                                syncAllFields();
                            }}
                            placeholder="Nhập giá hiện bán"
                            value={formValues.currentPrice}
                        />
                        <Button
                            icon={<CiCircleOutlined/>}
                            title="Làm Tròn"
                            onClick={() => handleRoundPrice('currentPrice')}
                        />
                    </Space.Compact>
                </Form.Item>
            </div>

            {/* Constraints Section */}
            <div style={{marginBottom: 16, backgroundColor: "#f9f9f9", padding: 12, borderRadius: 4, border: "1px solid #e8e8e8"}}>
                <div style={{marginBottom: 8}}>
                    <strong>Điều kiện về giá:</strong>
                </div>
                <ul style={{margin: 0, paddingLeft: 20}}>
                    <li>Giá nhập hàng + 20% ≤ Giá hiện bán ≤ Giá gốc</li>
                    <li>Lợi nhuận không được dưới 20%</li>
                    <li>Giảm giá không được quá 99%</li>
                </ul>
            </div>

            {/* Inventory Section */}
            <div style={{display: "flex", gap: 16}}>
                <Form.Item
                    name="totalQuantity"
                    label="Tổng Hàng Đã Nhập"
                    tooltip="Tổng số hàng đã nhập kho = Hàng sẵn bán + Hàng đã bán"
                    style={{flex: 1}}
                >
                    <InputNumber
                        disabled
                        min={0}
                        style={{width: "100%"}}
                        value={formValues.totalQuantity}
                    />
                </Form.Item>

                <Form.Item
                    name="availableQuantity"
                    label="Hàng sẵn bán"
                    tooltip="Số lượng hàng hiện có thể bán"
                    rules={[{required: true, message: "Nhập số hàng sẵn bán"}]}
                    style={{flex: 1}}
                >
                    <InputNumber
                        min={0}
                        defaultValue={0}
                        style={{width: "100%"}}
                        onChange={(value) => handleQuantityChangeEnhanced('availableQuantity', Number(value))}
                        value={formValues.availableQuantity}
                    />
                </Form.Item>

                <Form.Item
                    name="reservedQuantity"
                    label="Hàng đã bán"
                    tooltip="Số lượng hàng đã bán ra"
                    style={{flex: 1}}
                >
                    <InputNumber
                        disabled
                        min={0}
                        defaultValue={0}
                        style={{width: "100%"}}
                        value={formValues.reservedQuantity}
                    />
                </Form.Item>
            </div>
        </>
    );
};

export default PricingInventoryTab;
