module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: DataTypes.TEXT,
    idParent: DataTypes.INTEGER,
  });

  return Comment;
};
