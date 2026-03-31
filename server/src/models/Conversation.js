module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define(
    "Conversation",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      idUser1: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      idUser2: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "conversations",
    }
  );

  return Conversation;
};
