import AssetsConstant from "../../consts/AssetsConstant";

const CardActionItem = () => {
  return (
    <button onClick={() => console.log("add to cart")}>
      <img src={AssetsConstant.ADD_TO_CART} alt="Add to Cart" />
    </button>
  );
};
export default CardActionItem;
