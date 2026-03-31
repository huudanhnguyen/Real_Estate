module.exports = (sequelize, DataTypes) => {
  const PostImage = sequelize.define(
    "PostImage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      idPost: {
        type: DataTypes.STRING, // UUID -> STRING là đúng
        allowNull: false,
      },

      url: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false, // MUST HAVE để xoá trên Dropbox
      },

      isPrimary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "post_images",
      timestamps: true,
    }
  );

  // --------------------------------------------
  // ASSOCIATION
  // --------------------------------------------
  PostImage.associate = (models) => {
    PostImage.belongsTo(models.Post, { foreignKey: "idPost" });
  };

  return PostImage;
};
