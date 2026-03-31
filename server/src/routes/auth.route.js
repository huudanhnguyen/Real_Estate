const express = require("express");
const AuthController = require("@controllers/auth.controller");
const verifyToken = require("@middlewares/auth.middleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.get("/me", verifyToken, AuthController.me);
router.post("/refresh", AuthController.refresh);

router.get("/google", (req, res) => {
  const redirect = process.env.GOOGLE_REDIRECT_URI;

  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: redirect,
      response_type: "code",
      scope,
      access_type: "offline",
      prompt: "consent",
    });

  res.redirect(url);
});

router.get("/google/callback", AuthController.googleLogin);

// QUÊN MẬT KHẨU
router.post("/forgot-password", AuthController.forgotPassword);
router.get("/verify-reset-token", AuthController.verifyResetToken);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
