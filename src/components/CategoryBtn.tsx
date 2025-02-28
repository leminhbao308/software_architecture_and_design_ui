import AssetsConstant from "../consts/AssetsConstant";

const CategoryBtn = () => {
  return (
    <div className="category-btn">
      <img src={AssetsConstant.WHITE_MENU_ICON} alt="menu icon" />
      <p>Danh mục</p>
      <ul className="categories">
        <li className="category">Le Hoang Nam</li>
        <li className="category">Le Minh Bao</li>
        <li className="category">Nguyen Hong Duc</li>
        <li className="category">Nguyen Trong Tien</li>
        <li className="category">Tat ca deu la dong chi</li>
      </ul>
    </div>
  );
};

export default CategoryBtn;
