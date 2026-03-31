// src/models/Rating.js
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      idPost: {
        type: DataTypes.STRING, // 🔥 UUID phải là STRING
        allowNull: false,
      },

      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      star: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },

      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "ratings",
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ["idUser", "idPost"], // mỗi user chỉ được rate 1 bài
        },
      ],
    }
  );

  return Rating;
};
