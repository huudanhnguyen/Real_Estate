const express = require("express");
const upload = require("@middlewares/upload.middleware");
const UploadController = require("@controllers/upload.controller");
const verifyToken = require("@middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/post-images/:idPost",
  verifyToken,
  upload.array("images", 10),
  UploadController.uploadPostImages
);

router.delete(
  "/post-images/:imageId",
  verifyToken,
  UploadController.deleteImage
);

router.put(
  "/post-images/:imageId/set-primary",
  verifyToken,
  UploadController.setPrimaryImage
);

module.exports = router;
