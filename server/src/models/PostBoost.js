module.exports = (sequelize, DataTypes) => {
  const PostBoost = sequelize.define("PostBoost", {
    idPost: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },

    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    idPricing: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    expiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return PostBoost;
};
