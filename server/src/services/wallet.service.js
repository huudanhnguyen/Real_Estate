const { Transaction, User, sequelize } = require("@models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createTopup = async (userId, amount) => {
  if (!amount || amount <= 0) {
    throw new Error("Số tiền không hợp lệ");
  }

  const finalAmount = Math.round(amount);

  const tx = await Transaction.create({
    idUser: userId,
    type: "topup",
    amount: finalAmount,
    description: "Nạp tiền Stripe",
    status: "pending",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "vnd",
          product_data: {
            name: `Nạp ${finalAmount.toLocaleString("vi-VN")} đ`,
          },
          unit_amount: finalAmount,
        },
        quantity: 1,
      },
    ],

    metadata: {
      transactionId: tx.id.toString(),
      userId: userId.toString(),
    },

    success_url: "http://localhost:5173/seller/payment-result?success=1",
    cancel_url: "http://localhost:5173/seller/payment-result?success=0",
  });

  return {
    transactionId: tx.id,
    paymentUrl: session.url,
  };
};

// ================= CONFIRM TOPUP (WEBHOOK) =================
exports.confirmTopup = async (transactionId) => {
  console.log("👉 CONFIRM TX:", transactionId);
  return sequelize.transaction(async (t) => {
    const tx = await Transaction.findByPk(transactionId, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!tx) {
      throw new Error("Transaction không tồn tại");
    }

    if (tx.status === "success") {
      console.log("⚠️ Transaction đã xử lý rồi:", transactionId);
      return tx;
    }

    const user = await User.findByPk(tx.idUser, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    tx.balanceBefore = user.balance;

    console.log("💰 BEFORE:", user.balance);
    console.log("💰 ADD:", tx.amount);

    user.balance += tx.amount;

    console.log("💰 AFTER:", user.balance);

    tx.balanceAfter = user.balance;
    tx.status = "success";

    await user.save({ transaction: t });
    await tx.save({ transaction: t });

    console.log(`💰 USER ${user.id} +${tx.amount} → ${tx.balanceAfter}`);

    return tx;
  });
};
