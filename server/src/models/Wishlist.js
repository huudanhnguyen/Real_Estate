module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define(
    "Wishlist",
    {
      idUser: {
        type: DataTypes.INTEGER, // FK từ Users.id
        allowNull: false,
      },
      idPost: {
        type: DataTypes.STRING, // FK từ Posts.idPost (UUID)
        allowNull: false,
      },
    },
    {
      tableName: "wishlists",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["idUser", "idPost"], // mỗi user chỉ wishlist 1 bài 1 lần
        },
      ],
    }
  );

  return Wishlist;
};
