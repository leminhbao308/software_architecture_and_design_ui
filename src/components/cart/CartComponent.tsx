import AssetsConstant from "../../consts/AssetsConstant";
import CartItemComponent from "./CartItemComponent";

const CartComponent = () => {
  return (
    <div className="cart-container">
      <div className="cart-preview">
        <div className="cart-icon">
          <img src={AssetsConstant.CART_ICON} alt="Cart Icon" />
        </div>
        <p className="total-item">1</p>
      </div>
      <div className="carts">
        <div className="cart-wrapper">
          <CartItemComponent />
          <CartItemComponent />
          <CartItemComponent />
          <CartItemComponent /> 
          <CartItemComponent />
          <CartItemComponent />
        </div>
        <button className="view-cart-detail">View Cart Detail</button>
      </div>
    </div>
  );
};

export default CartComponent;
