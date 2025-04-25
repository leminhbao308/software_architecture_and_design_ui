import axios from "axios";
import APIConst from "../../consts/APIConst.ts";
import {OrderType} from "../../types/order/OrderType.ts";

const OrderService = {
    /**
     * Gets all orders for the current user
     * @param {string} token - Access token to perform request
     * @param {string} userId - User id to perform query
     * @returns {Promise<OrderType[]>} - List of user's orders
     */
    getUserOrders: async (token: string, userId: string) => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}/orders?user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data && response.data.code === 200) {
                return response.data.data;
            } else {
                throw new Error(response.data?.message || "Không thể lấy danh sách đơn hàng");
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
            throw error;
        }
    },

    /**
     * Gets details for a specific order
     * @param {string} access_token - Access token to perform request
     * @param {string} orderId - Order ID to get details for
     * @returns {Promise<Object>} - Order details
     */
    getOrderDetails: async (access_token: string, orderId: string): Promise<OrderType> => {
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

    /**
     * Cancel an order if it's not yet paid
     * @param {string} access_token - Access token to perform request
     * @param {string} orderId - Order ID to cancel
     * @returns {Promise<Object>} - Updated order details
     */
    cancelOrder: async (access_token: string, orderId: string) => {
        try {
            const response = await axios.post(
                `${APIConst.API_CONTEXT}/orders/${orderId}/cancel`,
                {},
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
                throw new Error(response.data?.message || "Không thể hủy đơn hàng");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw error;
        }
    }
};

export default OrderService;
