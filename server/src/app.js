const express = require("express");
const cors = require("cors");

const authRoute = require("@routes/auth.route");
const postRoute = require("@routes/post.route");
const uploadRoute = require("@routes/upload.route");
const wishlistRoute = require("@routes/wishlist.route");
const commentRoute = require("@routes/comment.route");
const ratingRoute = require("@routes/rating.route");
const tagRoute = require("@routes/tag.routes");
const tagpostRoute = require("@routes/tagpost.routes");
const chatRoute = require("@routes/chat.routes");
const notificationRoutes = require("@routes/notification.route");
const walletRoute = require("@routes/wallet.route");
const boostRoute = require("@routes/postBoost.route");
const pricingRoute = require("@routes/pricing.route");
const walletController = require("@controllers/wallet.controller");

const userRoute = require("@routes/user.route");
const adminRoute = require("@routes/admin.route");

const app = express();

app.use(cors());
app.post(
  "/api/wallets/webhook",
  express.raw({ type: "application/json" }),
  walletController.handleWebhook,
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/comments", commentRoute);
app.use("/api/ratings", ratingRoute);
app.use("/api/tags", tagRoute);
app.use("/api/tagposts", tagpostRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notifications", notificationRoutes);
app.use("/api/wallets", walletRoute);
app.use("/api/boost", boostRoute);
app.use("/api/pricings", pricingRoute);


app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);

module.exports = app;
