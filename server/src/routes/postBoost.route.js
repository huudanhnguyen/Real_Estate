const router = require("express").Router();
const controller = require("@controllers/postBoost.controller");
const auth = require("@middlewares/auth.middleware");
const { requireRole } = require("@middlewares/role.middleware");

router.post(
  "/posts/:postId/boost",
  auth,
  requireRole(["seller"]),
  controller.boostPost,
);


router.post(
  "/posts/:postId/boost/renew",
  auth,
  requireRole(["seller"]),
  controller.renewBoost,
);

module.exports = router;
