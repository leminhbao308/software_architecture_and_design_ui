import axios from "axios";
import APIConst from "../../consts/APIConst.ts";

const AdminService = {

    checkServicesStatus: async (token: string) => {
        try {
            const response = await axios.get(
                `${APIConst.API_CONTEXT}${APIConst.GET_SERVICES_STATUS}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Get service status failed: ", error);
            throw error;
        }
    }
};

export default AdminService;
