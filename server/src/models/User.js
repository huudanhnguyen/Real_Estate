module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    fullName: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    phoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING },
    avatarPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: { type: DataTypes.BIGINT, defaultValue: 0 },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    resetPwdToken: { type: DataTypes.STRING },
    resetPwdExpiry: { type: DataTypes.DATE },

    role: {
      type: DataTypes.ENUM("user", "admin", "seller"),
      defaultValue: "user",
    },
    isLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lockedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lockReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return User;
};
