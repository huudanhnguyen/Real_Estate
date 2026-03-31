const express = require("express");
const router = express.Router();

const TagPostController = require("@controllers/tagpost.controller");

router.get("/:postId", TagPostController.getTagsByPost);
router.post("/:postId", TagPostController.addTag);
router.delete("/:postId", TagPostController.removeTag);

module.exports = router;
