const express = require("express");
const verifyToken = require("@middlewares/auth.middleware");
const upload = require("@middlewares/upload.middleware");
const UserController = require("@controllers/user.controller");

const router = express.Router();

router.get("/me", verifyToken, UserController.getProfile);

router.put("/update", verifyToken, UserController.updateProfile);

router.patch("/change-password", verifyToken, UserController.changePassword);

router.put(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  UserController.uploadAvatar
);

router.delete("/avatar", verifyToken, UserController.deleteAvatar);

router.get("/my-posts", verifyToken, UserController.myPosts);

module.exports = router;
