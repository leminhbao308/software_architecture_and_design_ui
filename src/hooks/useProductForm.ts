// File: hooks/useProductForm.ts
import {FormInstance} from "antd/lib/form";
import {notification} from "antd";

// This hook can be used to share common form logic across components
export const useProductForm = (form: FormInstance) => {
    // Constants for validation
    const MIN_PROFIT_PERCENTAGE = 20; // Minimum 20% profit
    const MAX_DISCOUNT_PERCENTAGE = 99; // Maximum 99% discount
    const MIN_PRICE_RATIO = 0.8; // Minimum current price is 80% of cost price

    // Round to nearest thousand
    const roundToThousand = (value: number): number => {
        return Math.round(value / 1000) * 1000;
    };

    // Calculate base price from cost price and profit percentage
    const calculateBasePrice = (costPrice: number, profitPercentage: number) => {
        if (!costPrice || costPrice <= 0) return 0;
        return Math.round(costPrice * (1 + profitPercentage / 100));
    };

    // Calculate current price from base price and discount percentage
    const calculateCurrentPrice = (basePrice: number, discountPercentage: number) => {
        if (!basePrice || basePrice <= 0) return 0;
        return Math.round(basePrice * (1 - discountPercentage / 100));
    };

    // Calculate profit percentage from cost price and base price
    const calculateProfitPercentage = (costPrice: number, basePrice: number) => {
        if (!costPrice || costPrice <= 0 || !basePrice || basePrice <= 0) return 0;
        return Math.round(((basePrice - costPrice) / costPrice) * 100);
    };

    // Calculate discount percentage from base price and current price
    const calculateDiscountPercentage = (basePrice: number, currentPrice: number) => {
        if (!basePrice || basePrice <= 0 || !currentPrice || currentPrice <= 0) return 0;
        return Math.max(0, Math.round(((basePrice - currentPrice) / basePrice) * 100));
    };

    // Ensure profit percentage is at least minimum required
    const ensureMinimumProfit = (profitPercentage: number) => {
        return Math.max(profitPercentage, MIN_PROFIT_PERCENTAGE);
    };

    // Ensure discount percentage is not over maximum allowed
    const ensureMaximumDiscount = (discountPercentage: number) => {
        return Math.min(discountPercentage, MAX_DISCOUNT_PERCENTAGE);
    };

    // Validate price relationships and adjust if necessary
    const validatePrices = (costPrice: number, basePrice: number, currentPrice: number) => {
        if (!costPrice || costPrice <= 0) return false;

        let isAdjusted = false;
        let newBasePrice = basePrice;
        let newCurrentPrice = currentPrice;
        let newProfitPercentage = calculateProfitPercentage(costPrice, basePrice);
        let newDiscountPercentage = calculateDiscountPercentage(basePrice, currentPrice);

        // 1. Ensure minimum profit percentage (base price >= cost price * 1.2)
        if (newProfitPercentage < MIN_PROFIT_PERCENTAGE) {
            newProfitPercentage = MIN_PROFIT_PERCENTAGE;
            newBasePrice = calculateBasePrice(costPrice, newProfitPercentage);
            isAdjusted = true;

            notification.warning({
                message: "Điều chỉnh lợi nhuận",
                description: `Lợi nhuận đã được điều chỉnh lên mức tối thiểu ${MIN_PROFIT_PERCENTAGE}%`,
            });
        }

        // 2. Ensure current price is not less than minimum allowed (80% of cost price)
        const minCurrentPrice = costPrice * (1 + MIN_PRICE_RATIO);
        if (currentPrice < minCurrentPrice) {
            newCurrentPrice = Math.ceil(minCurrentPrice);
            newDiscountPercentage = calculateDiscountPercentage(newBasePrice, newCurrentPrice);
            isAdjusted = true;

            notification.warning({
                message: "Điều chỉnh giá hiện tại",
                description: `Giá hiện tại không được thấp hơn ${Math.round(MIN_PRICE_RATIO * 100)}% giá nhập hàng. Đã điều chỉnh tự động.`,
            });
        }

        // 3. Ensure current price is not higher than base price
        if (currentPrice > newBasePrice) {
            newCurrentPrice = newBasePrice;
            newDiscountPercentage = 0;
            isAdjusted = true;

            notification.warning({
                message: "Điều chỉnh giá hiện tại",
                description: "Giá hiện tại không được cao hơn giá gốc. Đã điều chỉnh tự động.",
            });
        }

        // 4. Ensure discount is not over maximum
        if (newDiscountPercentage > MAX_DISCOUNT_PERCENTAGE) {
            newDiscountPercentage = MAX_DISCOUNT_PERCENTAGE;
            newCurrentPrice = calculateCurrentPrice(newBasePrice, newDiscountPercentage);
            isAdjusted = true;

            notification.warning({
                message: "Điều chỉnh giảm giá",
                description: `Giảm giá không được vượt quá ${MAX_DISCOUNT_PERCENTAGE}%. Đã điều chỉnh tự động.`,
            });
        }

        // Apply adjustments if necessary
        if (isAdjusted) {
            form.setFieldsValue({
                basePrice: newBasePrice,
                currentPrice: newCurrentPrice,
                profitPercentage: newProfitPercentage,
                discountPercentage: newDiscountPercentage
            });
        }

        return true;
    };

    // Handle cost price change
    const handleCostPriceChange = (value: number) => {
        if (!value || value <= 0) return;

        const currentValues = form.getFieldsValue();
        const profitPercentage = ensureMinimumProfit(currentValues.profitPercentage || MIN_PROFIT_PERCENTAGE);
        const basePrice = calculateBasePrice(value, profitPercentage);

        // If basePrice exists, calculate discount from there
        let currentPrice = currentValues.currentPrice;
        let discountPercentage = currentValues.discountPercentage || 0;

        // If no current price yet, calculate from base price and discount
        if (!currentPrice || currentPrice <= 0) {
            discountPercentage = ensureMaximumDiscount(discountPercentage);
            currentPrice = calculateCurrentPrice(basePrice, discountPercentage);
        } else {
            // If current price exists, recalculate discount percentage
            discountPercentage = calculateDiscountPercentage(basePrice, currentPrice);
        }

        form.setFieldsValue({
            costPrice: value,
            profitPercentage: profitPercentage,
            basePrice: basePrice,
            discountPercentage: discountPercentage,
            currentPrice: currentPrice
        });

        // Validate and adjust prices if necessary
        validatePrices(value, basePrice, currentPrice);
    };

    // Handle base price direct change
    const handleBasePriceChange = (value: number) => {
        if (!value || value <= 0) return;

        const costPrice = form.getFieldValue('costPrice') || 0;
        if (costPrice <= 0) {
            notification.warning({
                message: "Lưu ý về giá",
                description: "Vui lòng nhập giá nhập hàng trước",
            });
            return;
        }

        // Calculate profit percentage
        let newProfitPercentage = calculateProfitPercentage(costPrice, value);
        if (newProfitPercentage < MIN_PROFIT_PERCENTAGE) {
            newProfitPercentage = MIN_PROFIT_PERCENTAGE;
            const minimumBasePrice = calculateBasePrice(costPrice, newProfitPercentage);

            if (value < minimumBasePrice) {
                notification.warning({
                    message: "Điều chỉnh giá gốc",
                    description: `Giá gốc phải đảm bảo lợi nhuận tối thiểu ${MIN_PROFIT_PERCENTAGE}%. Đã điều chỉnh tự động.`,
                });
                value = minimumBasePrice;
            }
        }

        // Get current values
        const currentValues = form.getFieldsValue();
        let currentPrice = currentValues.currentPrice || 0;
        let discountPercentage = currentValues.discountPercentage || 0;

        // If no current price yet, calculate from base price and discount
        if (!currentPrice || currentPrice <= 0) {
            discountPercentage = ensureMaximumDiscount(discountPercentage);
            currentPrice = calculateCurrentPrice(value, discountPercentage);
        } else {
            // If current price exists, recalculate discount percentage
            discountPercentage = calculateDiscountPercentage(value, currentPrice);
        }

        form.setFieldsValue({
            basePrice: value,
            profitPercentage: newProfitPercentage,
            discountPercentage: discountPercentage,
            currentPrice: currentPrice
        });

        // Validate prices
        validatePrices(costPrice, value, currentPrice);
    };

    // Handle current price direct change
    const handleCurrentPriceChange = (value: number) => {
        if (!value || value <= 0) return;

        const basePrice = form.getFieldValue('basePrice') || 0;
        if (basePrice <= 0) {
            notification.warning({
                message: "Lưu ý về giá",
                description: "Vui lòng nhập giá gốc trước",
            });
            return;
        }

        const costPrice = form.getFieldValue('costPrice') || 0;
        let adjustedValue = value;

        // Ensure current price is not below minimum (80% of cost price)
        const minCurrentPrice = costPrice * (1 + MIN_PRICE_RATIO);
        if (value < minCurrentPrice && costPrice > 0) {
            adjustedValue = Math.ceil(minCurrentPrice);
            notification.warning({
                message: "Điều chỉnh giá hiện tại",
                description: `Giá hiện tại không được thấp hơn ${Math.round(MIN_PRICE_RATIO * 100)}% giá nhập hàng. Đã điều chỉnh tự động.`,
            });
        }

        // Ensure current price is not higher than base price
        if (value > basePrice) {
            adjustedValue = basePrice;
            notification.warning({
                message: "Điều chỉnh giá hiện tại",
                description: "Giá hiện tại không được cao hơn giá gốc. Đã điều chỉnh tự động.",
            });
        }

        // Calculate discount percentage based on the adjusted current price
        const newDiscountPercentage = calculateDiscountPercentage(basePrice, adjustedValue);

        form.setFieldsValue({
            currentPrice: adjustedValue,
            discountPercentage: newDiscountPercentage
        });

        // Validate prices
        validatePrices(costPrice, basePrice, adjustedValue);
    };

    // Handle quantity change to update total
    const handleQuantityChange = (fieldName: string, value: number) => {
        const currentValues = form.getFieldsValue();
        const reservedQty = fieldName === 'reservedQuantity' ? value : (currentValues.reservedQuantity || 0);
        const availableQty = fieldName === 'availableQuantity' ? value : (currentValues.availableQuantity || 0);

        // Calculate and update total quantity immediately
        const totalQty = availableQty + reservedQty;
        form.setFieldsValue({
            [fieldName]: value,
            totalQuantity: totalQty
        });
    };

    // Process and validate form values before submission
    const processFormBeforeSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Process attributes if provided
            if (values.additionalAttributes) {
                try {
                    values.additionalAttributes = JSON.parse(values.additionalAttributes);
                } catch (err: unknown) {
                    notification.error({
                        message: "Invalid attributes format",
                        description: "Please enter valid JSON format for attributes",
                    });
                    console.error(err)
                    return null;
                }
            }

            // Validate price relationships
            const costPrice = values.costPrice || 0;
            const basePrice = values.basePrice || 0;
            const currentPrice = values.currentPrice || 0;

            const isValid = validatePrices(costPrice, basePrice, currentPrice);
            if (!isValid) return null;

            // Calculate total quantity
            values.totalQuantity = (values.availableQuantity || 0) + (values.reservedQuantity || 0);

            return values;
        } catch (error: unknown) {
            notification.error({
                message: "Form validation failed",
                description: "Please check the form fields and try again",
            });
            console.error(error)
            return null;
        }
    };

    return {
        roundToThousand,
        calculateBasePrice,
        calculateCurrentPrice,
        calculateProfitPercentage,
        calculateDiscountPercentage,
        validatePrices,
        handleCostPriceChange,
        handleProfitChange: handleBasePriceChange, // Simplified to use base price directly
        handleBasePriceChange,
        handleDiscountChange: handleCurrentPriceChange, // Simplified to use current price directly
        handleCurrentPriceChange,
        handleQuantityChange,
        processFormBeforeSubmit
    };
};

export default useProductForm;
