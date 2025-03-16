import AssetsConstant from "../../consts/AssetsConstant";
import { ProductType } from "../../types/ProductType";
interface ProductCardProps {
  product: ProductType;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card product">
      <img
        src={AssetsConstant.PRODUCTS.IPHONE_16_PRO_MAX}
        className="card-img-top"
        alt="..."
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <a href="#" className="btn btn-primary">
          Go somewhere
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
