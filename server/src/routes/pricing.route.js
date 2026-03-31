const router = require("express").Router();
const controller = require("@controllers/pricing.controller");

router.get("/", controller.getAllPricing);

module.exports = router;
