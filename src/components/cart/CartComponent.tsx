import AssetsConstant from "../../consts/AssetsConstant";

const CartComponent = () => {
  return (
    <div className="cart-container">
      <div className="cart-icon">
        <img src={AssetsConstant.CART_ICON} alt="Cart Icon" />
      </div>
      <p className="total-item">1</p>
    </div>
  );
};

export default CartComponent;
