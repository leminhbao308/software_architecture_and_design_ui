import axios from "axios";
import APIConst from "../../consts/APIConst.ts";

const PaymentService = {
    /**
     * Sends checkout request to create order and get payment link
     * @param {Object} orderData - Order data with customer and products information
     * @returns {Promise<Object>} - Payment link and order information
     */
    checkout: async (access_token, orderData) => {
        try {
            const response = await axios.post(
                `${APIConst.API_CONTEXT}/orders/checkout`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Extract the data from the response based on the specified format
            if (response.data && response.data.code === 200 && response.data.data) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || "Không thể tạo liên kết thanh toán");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            throw error;
        }
    },

    /**
     * Verifies payment status after successful payment
     * @param {string} access_token - Access token to perform request
     * @param {string} orderId - Order ID to verify
     * @returns {Promise<Object>} - Payment status information
     */
    verifyPaymentSuccess: async (access_token: string, orderId: string) => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}/orders/payment/status/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && response.data.code === 200) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || "Không thể xác minh trạng thái thanh toán");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw error;
        }
    },

    /**
     * Gets order details
     * @param {string} access_token - Access token to perform request
     * @param {string} orderId - The order ID to fetch details for
     * @returns {Promise<Object>} - Order details
     */
    getOrderDetails: async (access_token: string, orderId: string) => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && response.data.code === 200) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || "Không thể lấy thông tin đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    },

    updateOrderStatus: async (access_token: string, orderCode: string, success = true) => {
        try {

            if (success) {
                const response = await axios.get(
                    `${APIConst.API_CONTEXT}/payments/success?orderCode=${orderCode}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data && response.data.code === 200) {
                    return response.data.data;
                } else {
                    throw new Error(response.data?.message || "Không thể lấy thông tin đơn hàng");
                }
            } else {
                const response = await axios.get(
                    `${APIConst.API_CONTEXT}/payments/cancel?orderCode=${orderCode}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data && response.data.code === 200) {
                    return response.data.data;
                } else {
                    throw new Error(response.data?.message || "Không thể lấy thông tin đơn hàng");
                }
            }

        } catch (error) {
            console.error("Error fetching order details:", error);
            throw error;
        }
    }
};

export default PaymentService;
