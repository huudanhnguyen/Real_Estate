const express = require("express");
const router = express.Router();

const TagController = require("@controllers/tag.controller");

router.get("/", TagController.getAll);
router.post("/", TagController.create);
router.delete("/:id", TagController.delete);

module.exports = router;
