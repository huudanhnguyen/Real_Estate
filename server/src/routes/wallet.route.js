const router = require("express").Router();
const express = require("express");

const WalletController = require("@controllers/wallet.controller");
const auth = require("@middlewares/auth.middleware");

router.post("/topup", auth, WalletController.createTopup);


router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  WalletController.handleWebhook
);

module.exports = router;
