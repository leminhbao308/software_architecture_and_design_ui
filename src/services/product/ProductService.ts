import axios from "axios";
import APIConst from "../../consts/APIConst";

const ProductService = {
  getAllProduct: async (access_token: string, categoryId?: string, page?: number, size?: number) => {
    try {
      // Tạo đối tượng URLSearchParams để xây dựng query parameters
      const params = new URLSearchParams();

      // Thêm các parameters nếu chúng được cung cấp
      if (categoryId) params.append("category_id", categoryId);
      if (page) params.append("page", page.toString());
      if (size) params.append("size", size.toString()); // Thêm size parameter nếu được cung cấp

      // Xây dựng URL với query parameters
      const queryString = params.toString();
      const url = `${APIConst.API_CONTEXT}${APIConst.GET_ALL_PRODUCTS}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      // Kiểm tra nếu response có data hợp lệ
      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Lấy sản phẩm thất bại");
        return [];
      }
    } catch (error) {
      console.error("get all products is failed", error);
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

  searchProducts: async (access_token: string, params: {
    name?: string,
    sku?: string,
    category?: string,
    brand?: string,
    page?: number,
    size?: number,
    sort_by?: string,
    sort_dir?: string
  }) => {
    try {
      // Create URLSearchParams for the search query
      const searchParams = new URLSearchParams();

      // Add all provided parameters
      if (params.name) searchParams.append("name", params.name);
      if (params.sku) searchParams.append("sku", params.sku);
      if (params.category) searchParams.append("category", params.category);
      if (params.brand) searchParams.append("brand", params.brand);
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.size) searchParams.append("size", params.size.toString());
      if (params.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params.sort_dir) searchParams.append("sort_dir", params.sort_dir);

      const queryString = searchParams.toString();
      const url = `${APIConst.API_CONTEXT}${APIConst.SEARCH_PRODUCT}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        console.log("Tìm kiếm sản phẩm thất bại");
        return { data: { content: [] } };
      }
    } catch (error) {
      console.error("search products failed", error);
      return { data: { content: [] } };
    }
  }
};
export default ProductService;
