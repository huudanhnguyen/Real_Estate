const { Post, Pricing, User, PostBoost, sequelize } = require("@models");
const { Op } = require("sequelize");

exports.boostPost = async ({ userId, postId, pricingId }) => {
  return sequelize.transaction(async (t) => {
    const post = await Post.findOne({
      where: {
        idPost: postId,
        idUser: userId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!post) {
      throw new Error("Post không tồn tại hoặc không thuộc quyền sở hữu");
    }

    const pricing = await Pricing.findByPk(pricingId, {
      transaction: t,
    });
    if (!pricing) {
      throw new Error("Gói boost không tồn tại");
    }

    const user = await User.findByPk(userId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!user) {
      throw new Error("User không tồn tại");
    }
    if (user.score < pricing.requireScore) {
      throw new Error("Chưa đủ điểm uy tín để dùng gói này");
    }

    if (user.balance < pricing.price) {
      throw new Error("Không đủ số dư");
    }

    // 5. Trừ tiền
    user.balance -= pricing.price;
    await user.save({ transaction: t });

    // 6. Tính hạn boost
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + pricing.expiredDay);

    // 7. Tạo record boost
    await PostBoost.create(
      {
        idPost: postId,
        idUser: userId,
        idPricing: pricingId,
        price: pricing.price,
        expiredAt,
      },
      { transaction: t }
    );

    return {
      message: "Đẩy tin thành công",
      expiredAt,
    };
  });
};

exports.renewBoost = async ({ userId, postId }) => {
  return sequelize.transaction(async (t) => {
    // 1️⃣ Lấy tất cả boost của post
    const boosts = await PostBoost.findAll({
      where: {
        idPost: postId,
        idUser: userId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!boosts.length) {
      throw new Error("Không có boost để gia hạn");
    }

    // 2️⃣ Lấy boost có expiredAt lớn nhất (QUAN TRỌNG)
    const currentBoost = boosts.reduce((latest, item) => {
      if (!latest) return item;
      return new Date(item.expiredAt) > new Date(latest.expiredAt)
        ? item
        : latest;
    }, null);

    // 3️⃣ Lấy pricing
    const pricing = await Pricing.findByPk(currentBoost.idPricing, {
      transaction: t,
    });

    if (!pricing) {
      throw new Error("Gói boost không tồn tại");
    }

    // 4️⃣ Lock user
    const user = await User.findByPk(userId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    if (user.balance < pricing.price) {
      throw new Error("Không đủ số dư để gia hạn");
    }

    // 5️⃣ Trừ tiền
    user.balance -= pricing.price;
    await user.save({ transaction: t });

    // 6️⃣ Tính thời gian mới (CỘNG DỒN CHUẨN)
    const baseDate =
      new Date(currentBoost.expiredAt) > new Date()
        ? new Date(currentBoost.expiredAt)
        : new Date();

    const newExpiredAt = new Date(baseDate);
    newExpiredAt.setDate(newExpiredAt.getDate() + pricing.expiredDay);

    // 7️⃣ Tạo record mới
    await PostBoost.create(
      {
        idPost: postId,
        idUser: userId,
        idPricing: pricing.id,
        price: pricing.price,
        expiredAt: newExpiredAt,
      },
      { transaction: t },
    );

    return {
      message: "Gia hạn boost thành công",
      expiredAt: newExpiredAt,
    };
  });
};
