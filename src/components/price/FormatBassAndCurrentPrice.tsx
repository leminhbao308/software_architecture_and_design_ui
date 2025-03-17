import FormatCurrency from "../../utils/formatCurrency";

/**
 *
 * @param basePrice giá gốc
 * @param currentPrice giá hiện tại có thể đã được áp dụng coupon
 * @returns price sau khi được format
 */
const FormatBaseAndCurrentPrice = (
  basePrice: number | bigint,
  currentPrice: number | bigint
) => {
  return (
    <div  className="prices">
      {basePrice > currentPrice ? (
        <>
          <span className="main-price">{FormatCurrency(currentPrice)}</span>
          <del className="secondary-price">{FormatCurrency(basePrice)}</del>
        </>
      ) : (
        <span className="main-price">{FormatCurrency(basePrice)}</span>
      )}
    </div>
  );
};

export default FormatBaseAndCurrentPrice;
