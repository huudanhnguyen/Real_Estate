module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    balanceBefore: DataTypes.BIGINT,
    balanceAfter: DataTypes.BIGINT,
    scoreChange: DataTypes.INTEGER,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    referenceId: DataTypes.INTEGER,
  });

  return Transaction;
};
