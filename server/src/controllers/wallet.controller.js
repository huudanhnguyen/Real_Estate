const asyncHandler = require("@utils/asyncHandler");
const WalletService = require("@services/wallet.service");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ================= CREATE TOPUP =================
exports.createTopup = asyncHandler(async (req, res) => {
  const amount = req.body?.amount;

  if (!amount) {
    return res.status(400).json({
      message: "Thiếu số tiền",
    });
  }

  const result = await WalletService.createTopup(req.user.id, amount);

  return res.json({
    message: "Tạo link thanh toán thành công",
    paymentUrl: result.paymentUrl,
  });
});

// ================= STRIPE WEBHOOK =================
exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("📦 EVENT TYPE:", event.type);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📦 EVENT:", event.type);

if (event.type === "checkout.session.completed") {
  const session = event.data.object;

  console.log("💰 FULL SESSION:", session);

  const transactionId = session.metadata?.transactionId;

  console.log("💰 TX ID:", transactionId);

  await WalletService.confirmTopup(transactionId);

  console.log("✅ ĐÃ CỘNG TIỀN");
}

  res.json({ received: true });
};
