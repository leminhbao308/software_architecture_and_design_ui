import { Link } from "react-router-dom";
import PathConst from "../consts/PathConst";
import AssetsConstant from "../consts/AssetsConstant";
import ProductCard from "./products/ProductCard";
import ProductService from "../services/product/ProductService";
import { useEffect, useState } from "react";
import { ProductType } from "../types/ProductType";
import SortComponent from "./sort/SortComponent";
import StatusConst from "../consts/StatusConst";
const WelcomeComponent = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [sortType, setSortType] = useState<"decrease" | "increase" | null>(
    null
  );

  const accessToken: string | null =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!accessToken) {
        console.log("AccessToken không tồn tại");
        return;
      }
      try {
        const data = await ProductService.getAllProduct(accessToken);
        const listProducts = data.data.content;
        if (Array.isArray(listProducts)) {
          setProducts(listProducts);
        } else {
          console.log("Không tồn tại product");
          setProducts([]);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };
    fetchProduct();
  }, []);

  // Phương thức sắp xếp sản phẩm giảm dần theo giá
  const handleSortDecrease = () => {
    setSortType("decrease");
    const sortStep01 = [...products].sort(
      (a, b) => b.currentPrice - a.currentPrice
    );
    const sortStep02 = sortStep01.filter(
      (product) => product.status === StatusConst.ACTIVE
    );

    const sortStep03 = sortStep01.filter(
      (product) => product.status === StatusConst.INACTIVE
    );
    const result = [...sortStep02, ...sortStep03];
    setProducts(result);
    console.log(products);
  };

  // Phương thức sắp xếp sản phẩm tăng dần theo giá
  const handleSortIncrease = () => {
    setSortType("increase");
    const sortStep01 = [...products].sort(
      (a, b) => a.currentPrice - b.currentPrice
    );
    const sortStep02 = sortStep01.filter(
      (product) => product.status === StatusConst.ACTIVE
    );

    const sortStep03 = sortStep01.filter(
      (product) => product.status === StatusConst.INACTIVE
    );
    const result = [...sortStep02, ...sortStep03];
    setProducts(result);
    console.log(products);
  };

  return (
    <div>
      <div className={"home-intro"}>
        <span>Welcome To</span>
        <Link to={PathConst.HOME}>
          <img
            src={AssetsConstant.BLACK_LOGO}
            alt={"logo"}
            className={"d-flex justify-content-center align-items-center"}
          />
        </Link>
      </div>
      <SortComponent
        onSortDecrease={handleSortDecrease}
        onSortIncrease={handleSortIncrease}
        currentSort={sortType}
      />
      <div className="row products">
        {products.map((product) => {
          return <ProductCard key={product.productId} product={product} />;
        })}
      </div>
    </div>
  );
};

export default WelcomeComponent;
