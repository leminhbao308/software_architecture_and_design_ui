import axios from "axios";
import APIConst from "../../consts/APIConst";

const LoginService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${APIConst.API_CONTEXT}${APIConst.LOGIN}`,
        {
          username,
          password,
        }
      );

      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("Login failed: ", error);
      throw error; // Ném lỗi để xử lý ở component gọi hàm này
    }
  },

    refreshToken: async (refreshToken: string) => {
        try {
            const response = await axios.post(
                `${APIConst.API_CONTEXT}${APIConst.REFRESH_TOKEN}?refresh_token=${refreshToken}`
            );

            return response.data;
        } catch (error) {
            console.error("Refresh token failed:", error);
            throw error;
        }
    }
};

export default LoginService;
