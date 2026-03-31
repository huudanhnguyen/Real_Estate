module.exports = (sequelize, DataTypes) => {
  const TagPost = sequelize.define(
    "TagPost",
    {
      idPost: {
        type: DataTypes.STRING, // UUID từ Post.idPost
        allowNull: false,
      },
      idTag: {
        type: DataTypes.INTEGER, // FK từ Tag.id
        allowNull: false,
      },
    },
    {
      tableName: "tag_posts",
      timestamps: false, // ✔ Không cần timestamps
    }
  );

  return TagPost;
};
