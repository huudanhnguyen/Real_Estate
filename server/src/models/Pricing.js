module.exports = (sequelize, DataTypes) => {
  const Pricing = sequelize.define("Pricing", {
    name: DataTypes.STRING,
    isShowDescription: DataTypes.BOOLEAN,
    priority: DataTypes.INTEGER,
    requireScore: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    expiredDay: DataTypes.INTEGER,
  });

  return Pricing;
};
