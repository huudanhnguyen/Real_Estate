const { Pricing } = require("@models");

exports.getAllPricing = async () => {
  const pricings = await Pricing.findAll({
    order: [["priority", "ASC"]],
  });

  return pricings;
};
