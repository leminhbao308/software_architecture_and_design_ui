import AssetsConstant from "../../consts/AssetsConstant";

const CartItemComponent = () => {
  return (
    <div className="cart-item">
      <div className="cart-img">
        <img src={AssetsConstant.PRODUCTS.IPHONE_16_PRO_MAX} alt="Logo" />
      </div>
      <div className="cart-item-content">
        <div className="item-name">Iphone 16 Pro Max 256GB</div>
        <div className="item-price">124.000 vnđ</div>
      </div>
      <div className="cart-item-action">
        <button>
          <img src={AssetsConstant.DELETE_ICON} alt="Icon Delete" />
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;
