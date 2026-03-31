module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      // ===============================
      // PRIMARY KEY
      // ===============================
      idPost: {
        type: DataTypes.STRING, // uuid
        primaryKey: true,
      },

      // ===============================
      // BASIC INFO
      // ===============================
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      address: DataTypes.STRING,
      province: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      // ===============================
      // PROPERTY DETAILS
      // ===============================
      size: DataTypes.INTEGER,
      floor: DataTypes.INTEGER,
      bedroom: DataTypes.INTEGER,
      bathroom: DataTypes.INTEGER,
      isFurniture: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // ===============================
      // PRICE
      // ===============================
      price: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      isNegotiable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // ===============================
      // TYPES
      // ===============================
      listingType: {
        type: DataTypes.ENUM("Bán", "Cho thuê"),
        allowNull: false,
      },

      propertyType: {
        type: DataTypes.ENUM(
          "Căn hộ chung cư",
          "Nhà mặt phố",
          "Nhà riêng",
          "Nhà phố thương mại",
          "Biệt thự",
          "Đất nền",
          "Bán đất",
          "Trang trại",
          "Khu nghỉ dưỡng",
          "Kho",
          "Nhà xưởng",
          "Khác",
        ),
        allowNull: false,
      },

      // ===============================
      // DIRECTION
      // ===============================
      direction: {
        type: DataTypes.ENUM(
          "Đông - Bắc",
          "Tây - Nam",
          "Đông - Nam",
          "Tây - Bắc",
          "Đông",
          "Tây",
          "Nam",
          "Bắc",
        ),
      },

      balonDirection: {
        type: DataTypes.ENUM(
          "Đông - Bắc",
          "Tây - Nam",
          "Đông - Nam",
          "Tây - Bắc",
          "Đông",
          "Tây",
          "Nam",
          "Bắc",
        ),
      },

      // ===============================
      // RATING
      // ===============================
      avgStar: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      // ===============================
      // TRANSACTION STATUS (USER SIDE)
      // ===============================
      status: {
        type: DataTypes.ENUM("Còn trống", "Đang thỏa thuận", "Đã bàn giao"),
        defaultValue: "Còn trống",
      },
      moderationStatus: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },

      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      rejectedReason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // ===============================
      // VERIFIED / EXPIRED
      // ===============================
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      expiredDate: DataTypes.DATE,
      expiredBoost: DataTypes.DATE,
      pricingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // ===============================
      // RELATION
      // ===============================
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "posts",
      timestamps: true,
    },
  );

  return Post;
};
