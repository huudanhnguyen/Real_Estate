const PricingService = require("@services/pricing.service");

exports.getAllPricing = async (req, res) => {
  try {
    const data = await PricingService.getAllPricing();

    return res.json({
      message: "Lấy danh sách gói boost thành công",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
