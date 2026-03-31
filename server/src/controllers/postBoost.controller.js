const PostBoostService = require("@services/postBoost.service");

exports.boostPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { pricingId } = req.body;
    const userId = req.user.id;

    if (!pricingId) {
      return res.status(400).json({
        message: "Thiếu pricingId",
      });
    }

    const result = await PostBoostService.boostPost({
      userId,
      postId,
      pricingId,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.renewBoost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const result = await PostBoostService.renewBoost({
      userId,
      postId,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
