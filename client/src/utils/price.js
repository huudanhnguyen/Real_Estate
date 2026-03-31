// Format giá để hiển thị trong input (có dấu . ngăn cách)
export const formatPriceInput = (value) => {
  if (!value) return "";
  const digits = value.toString().replace(/[^\d]/g, ""); // chỉ lấy số
  if (!digits) return "";
  return new Intl.NumberFormat("vi-VN").format(Number(digits));
};

// Convert giá từ input -> số để gửi backend
export const parsePriceToNumber = (value) => {
  if (!value) return 0;
  const digits = value.toString().replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

// Format hiển thị giá cho FE (Post Detail, Post List,...)
export const formatPriceDisplay = (price, isNegotiable = false) => {
  if (isNegotiable) return "Giá thoả thuận";
  if (!price) return "Giá đang cập nhật";
  return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};
