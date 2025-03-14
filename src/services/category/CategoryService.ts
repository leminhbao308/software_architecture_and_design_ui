import axios from "axios";
import APIConst from "../../consts/APIConst";

const CategoryService = {
  getAllCategory: async (access_token: string) => {
    try {
      const response = await axios.get(
        `${APIConst.API_CONTEXT}${APIConst.GET_ALL_CATEGORIES}`,
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
        throw new Error("Lấy danh mục thất bại");
      }
    } catch (error) {
      console.error("get all category is failed", error);
      throw error;
      return [];
    }
  },
};
export default CategoryService;
