import { Link } from "react-router-dom";
import PathConst from "../consts/PathConst";
import AssetsConstant from "../consts/AssetsConstant";
import ProductCard from "./products/ProductCard";
import ProductService from "../services/product/ProductService";
import { useEffect, useState } from "react";
import { ProductType } from "../types/ProductType";
const WelcomeComponent = () => {
  const [products, setProducts] = useState<ProductType[]>([]);

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
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };
    fetchProduct();
  }, []);

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
      <div className="row products">
        {products.map((product) => {
          return <ProductCard key={product.productId} product={product} />;
        })}
      </div>
    </div>
  );
};

export default WelcomeComponent;
