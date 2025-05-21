/**
 *
 * @param amount Đầu vào - số tiền cần định dạng
 * @param currencyCode Mẫ tiền tệ - định dạng của mỗi quốc gia (Mặc định là VND)
 * @param locale Ngôn ngữ và quốc gia để định dạng (Mặc định vi-VN)
 *
 *  --- Intl.NumberFormat: API có sẵn của JS để định dạng số theo chuẩn quốc tế
 *
 * @returns Số tiền đã được định dạng
 */
const FormatCurrency = (
    amount: bigint | number,
    currencyCode = "VND",
    locale = "vi-VN"
) => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

export default FormatCurrency;

/**
 * Format a number as Vietnamese Dong with thousands separators
 * @param value - Number or string to format
 * @returns Formatted price string
 */
export const formatPrice = (value: number | string | undefined): string => {
    if (value === undefined || value === null || value === '') return '';
    return `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Parse a formatted price string back to a raw number string
 * @param value - Formatted price string
 * @returns Raw number string with currency symbols and commas removed
 */
export const parsePrice = (value: string | undefined): string => {
    if (value === undefined || value === null) return '';
    return value.replace(/đ\s?|(,*)/g, "");
};

/**
 * Calculate base price from cost price and profit percentage
 * @param costPrice - Cost price
 * @param profitPercentage - Profit percentage
 * @returns Calculated base price
 */
export const calculateBasePrice = (costPrice: number, profitPercentage: number): number => {
    if (!costPrice || costPrice <= 0) return 0;
    return Math.round(costPrice * (1 + profitPercentage / 100));
};

/**
 * Calculate current price from base price and discount percentage
 * @param basePrice - Base price
 * @param discountPercentage - Discount percentage
 * @returns Calculated current price
 */
export const calculateCurrentPrice = (basePrice: number, discountPercentage: number): number => {
    if (!basePrice || basePrice <= 0) return 0;
    return Math.round(basePrice * (1 - discountPercentage / 100));
};

/**
 * Calculate profit percentage based on cost price and base price
 * @param costPrice - Cost price
 * @param basePrice - Base price
 * @returns Calculated profit percentage
 */
export const calculateProfitPercentage = (costPrice: number, basePrice: number): number => {
    if (!costPrice || costPrice <= 0 || !basePrice || basePrice <= 0) return 0;
    return Math.round(((basePrice - costPrice) / costPrice) * 100);
};

/**
 * Calculate discount percentage based on base price and current price
 * @param basePrice - Base price
 * @param currentPrice - Current price
 * @returns Calculated discount percentage
 */
export const calculateDiscountPercentage = (basePrice: number, currentPrice: number): number => {
    if (!basePrice || basePrice <= 0 || !currentPrice || currentPrice <= 0) return 0;
    return Math.round(((basePrice - currentPrice) / basePrice) * 100);
};

/**
 * Validate price relationships and return any error messages
 * @param costPrice - Cost price
 * @param basePrice - Base price
 * @param currentPrice - Current price
 * @returns Object with validation results
 */
export const validatePrices = (
    costPrice: number,
    basePrice: number,
    currentPrice: number
): {
    isValid: boolean;
    currentPriceError?: string;
    basePriceError?: string;
    minCurrentPrice?: number;
} => {
    // Initialize result
    const result = {isValid: true, minCurrentPrice: 0, currentPriceError: "", basePriceError: ""};

    // Minimum current price is 80% of cost price
    const minCurrentPrice = costPrice * 0.8;
    result.minCurrentPrice = minCurrentPrice;

    // Check if current price is below minimum allowed
    if (currentPrice < minCurrentPrice) {
        result.isValid = false;
        result.currentPriceError = "Giá hiện bán không được thấp hơn 80% giá nhập hàng";
    }

    // Check if current price exceeds base price
    if (currentPrice > basePrice) {
        result.isValid = false;
        result.currentPriceError = "Giá hiện bán không được cao hơn giá gốc";
    }

    // Check if base price is lower than or equal to cost price
    if (basePrice <= costPrice) {
        result.isValid = false;
        result.basePriceError = "Giá gốc phải cao hơn giá nhập hàng";
    }

    return result;
};

// Define common profit options
export const profitOptions = [
    {label: '10%', value: 10},
    {label: '15%', value: 15},
    {label: '20%', value: 20},
    {label: '25%', value: 25},
    {label: '30%', value: 30},
    {label: '40%', value: 40},
    {label: '50%', value: 50},
];

// Define common discount options
export const discountOptions = [
    {label: '0%', value: 0},
    {label: '5%', value: 5},
    {label: '10%', value: 10},
    {label: '15%', value: 15},
    {label: '20%', value: 20},
    {label: '25%', value: 25},
    {label: '30%', value: 30},
];
