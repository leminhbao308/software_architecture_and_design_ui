import axios from "axios";
import APIConst from "../../consts/APIConst";

const ProductService = {
  getAllProduct: async (access_token: string) => {
    try {
      const response = await axios.get(
        `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}`,
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
  getProductByProductId: async (access_token: string, productId: string) => {
    try {
      const response = await axios.get(
        `${APIConst.API_CONTEXT}${APIConst.GET_PRODUCT_BY_ID}/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        console.log(`Lấy sản phẩm với ID ${productId} thất bại`);
        return null;
      }
    } catch (error) {
      console.error(`Lấy sản phẩm với ID ${productId} thất bại:`, error);
      return null;
    }
  },
};
export default ProductService;
