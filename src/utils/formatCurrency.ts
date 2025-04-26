/**
 * 
 * @param amount Đầu vào - số tiền cần định dạng
 * @param currencyCode Mẫ tiền tệ - định dạng của mỗi quốc gia (Mặc định là VND)
 * @param locale Ngôn ngữ và quốc gia để định dạng (Mặc định vi-VN)
 * 
 *  --- Intl.NumberFormat: API có sẵn của JS để định dạng số theo chuẩn quốc tế
 * 
 * @returns Số tiền đã được định dạng
 */
const FormatCurrency = (
  amount: bigint | number,
  currencyCode = "VND",
  locale = "vi-VN"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default FormatCurrency;
