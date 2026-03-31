const express = require("express");
const PostController = require("@controllers/post.controller");
const verifyToken = require("@middlewares/auth.middleware");

const router = express.Router();

// CREATE
router.post("/", verifyToken, PostController.create);

// LISTING
router.get("/", PostController.list);

// DETAIL
router.get("/:idPost", PostController.detail);

// UPDATE
router.put("/:idPost", verifyToken, PostController.update);

// DELETE
router.delete("/:idPost", verifyToken, PostController.delete);

module.exports = router;
