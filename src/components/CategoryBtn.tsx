import { useEffect } from "react";
import AssetsConstant from "../consts/AssetsConstant";
import CategoryService from "../services/category/CategoryService";

const CategoryBtn = () => {
  const datas = [
    {
      name: "laptop",
    },
    {
      name: "Phone",
    },
    {
      name: "Computer",
    },
    {
      name: "Architecture and design software",
    },
  ];

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
        {datas.map((data, index) => {
          return (
            <li className="category" key={index}>
              {data.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryBtn;
