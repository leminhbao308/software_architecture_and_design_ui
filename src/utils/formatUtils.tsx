/**
 * Format a price value to Vietnamese currency format
 * @param price The price value to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        // Remove decimal places as Vietnamese currency typically doesn't show them
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};
