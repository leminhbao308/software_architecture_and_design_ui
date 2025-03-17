import { useLocation } from "react-router-dom";
import AssetsConstant from "../../consts/AssetsConstant";

const ProductDetail = () => {
  const location = useLocation();
  const product = location.state?.product;
  const debug = () => console.log(product);
  debug();
  return (
    <div className="container product-detail d-flex flex-column">
      <div>Name: {product.name}</div>
      <div>Base price: {product.basePrice}</div>
      <div>Current price: {product.currentPrice}</div>
      <div>Cost Price: {product.costPrice}</div>
      <div>Description: {product.description}</div>
      <div>Total Quantity: {product.totalQuantity}</div>
    </div>
  );
};

export default ProductDetail;
