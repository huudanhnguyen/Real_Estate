const express = require("express");
const WishlistController = require("@controllers/wishlist.controller");
const verifyToken = require("@middlewares/auth.middleware");

const router = express.Router();

router.post("/:postId", verifyToken, (req, res) =>
  WishlistController.add(req, res)
);

router.delete("/:postId", verifyToken, (req, res) =>
  WishlistController.remove(req, res)
);

router.get("/", verifyToken, (req, res) => WishlistController.list(req, res));

router.get("/:postId", verifyToken, (req, res) =>
  WishlistController.checkWishlist(req, res)
);

module.exports = router;
