import axios from "axios";
import APIConst from "../../consts/APIConst";

const GoogleAuthService = {
    /**
     * Get Google login URL
     */
    getLoginUrl: async () => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}/auth/google/login-url`
            );
            return response.data.data;
        } catch (error) {
            console.error("Failed to get Google login URL:", error);
            throw error;
        }
    },

    /**
     * Get Google registration URL
     */
    getRegisterUrl: async () => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}/auth/google/register-url`
            );
            return response.data;
        } catch (error) {
            console.error("Failed to get Google registration URL:", error);
            throw error;
        }
    },

    /**
     * Complete Google registration with phone number
     * This is used when the frontend collects the phone number separately
     */
    completeRegistration: async (code: string, phoneNumber: string) => {
        try {
            const response = await axios.post(
                `${APIConst.API_CONTEXT}/auth/google/register`,
                {
                    code,
                    phoneNumber
                }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to complete Google registration:", error);
            throw error;
        }
    }
};

export default GoogleAuthService;
