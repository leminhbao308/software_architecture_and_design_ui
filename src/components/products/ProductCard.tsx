import StatusConst from "../../consts/StatusConst";
import { ProductType } from "../../types/ProductType";
import FormatBaseAndCurrentPrice from "../price/formatBassAndCurrentPrice";
import CardAction from "./CardAction";
interface ProductCardProps {
  product: ProductType;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card product">
      <div onClick={() => console.log("View Product Detail")}>
        <img
          src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-14-plus_1__1.png"
          className="card-img-top"
          alt={product.name}
        />
        <div className="card-body">
          <p className="card-title__product--custom">{product.name}</p>
          {product.status === StatusConst.INACTIVE ? (
            <div style={{ color: "red", flex: 1 }}>Ngừng kinh doanh</div>
          ) : (
            <>
              {FormatBaseAndCurrentPrice(
                product.basePrice,
                product.currentPrice
              )}
              <p className="cart-text__product--description">
                <span className="cart-text__product--wrap">
                  {product.description}
                </span>
              </p>
            </>
          )}
        </div>
      </div>

      {product.totalQuantity > 0 ? (
        <>
          {product.status === StatusConst.ACTIVE ? (
            <>
              <div className="tag tag__coupon">Giảm 50%</div>
              <CardAction />
            </>
          ) : (
            ""
          )}
        </>
      ) : (
        <div className="tag tag__sold-out">Đang về hàng</div>
      )}
    </div>
  );
};

export default ProductCard;
