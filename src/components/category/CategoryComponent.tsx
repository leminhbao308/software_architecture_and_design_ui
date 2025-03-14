import React from "react";
import { useEffect, useState } from "react";
import AssetsConstant from "../../consts/AssetsConstant";
import CategoryService from "../../services/category/CategoryService";

interface CategoryType {
  id: string;
  name: string;
  children?: CategoryType[];
  metadata?: object;
}

const CategoryBtn = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const accessToken: string | null =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) {
        console.log("AccessToken không tồn tại");
        return;
      }

      try {
        const data = await CategoryService.getAllCategory(accessToken);
        const datas = data.data;
        if (Array.isArray(datas)) {
          setCategories(datas); // Đảm bảo chỉ cập nhật khi data là mảng
        } else {
          console.error("Dữ liệu API không phải là mảng:", datas);
          setCategories([]); // Gán mảng rỗng nếu dữ liệu không đúng định dạng
        }
      } catch (error) {
        console.error("Lấy danh mục thất bại:", error);
        setCategories([]); // Tránh lỗi khi API thất bại
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      <div className="category-btn">
        <img
          className="category-btn-img"
          src={AssetsConstant.WHITE_MENU_ICON}
          alt="menu icon"
        />
        <p className="category-btn-title">Danh mục</p>
      </div>
      <ul className="categories">
        {categories.map((data, index) => {
          return (
            <li className="category" key={data.id}>
              {data.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryBtn;
