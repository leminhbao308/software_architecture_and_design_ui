import axios from "axios";
import APIConst from "../../consts/APIConst";

const UserService = {
  getUserInfo: async (access_token: string) => {
    try {
      const response = await axios.get(
        `${APIConst.API_CONTEXT}${APIConst.GET_USER_INFO}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Kiểm tra nếu response có data hợp lệ
      if (response.status === 200) {
        // console.log(response);
        return response.data;
      } else {
        console.log("Lấy sản phẩm thất bại");
        return [];
      }
    } catch (error) {
      console.error("get all produtcs is failed", error);
      return [];
    }
  },
};

export default UserService;
