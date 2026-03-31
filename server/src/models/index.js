const { DataTypes } = require("sequelize");
const { sequelize } = require("@config/database");

/* =========================
   IMPORT MODELS
========================= */
const User = require("@models/User")(sequelize, DataTypes);
const Pricing = require("@models/Pricing")(sequelize, DataTypes);
const Post = require("@models/Post")(sequelize, DataTypes);
const Wishlist = require("@models/Wishlist")(sequelize, DataTypes);
const Comment = require("@models/Comment")(sequelize, DataTypes);
const Rating = require("@models/Rating")(sequelize, DataTypes);
const Tag = require("@models/Tag")(sequelize, DataTypes);
const TagPost = require("@models/TagPost")(sequelize, DataTypes);
const PostImage = require("@models/PostImage")(sequelize, DataTypes);
const Notification = require("@models/Notification")(sequelize, DataTypes);
const Conversation = require("@models/Conversation")(sequelize, DataTypes);
const Message = require("@models/Message")(sequelize, DataTypes);
const Transaction = require("@models/Transaction")(sequelize, DataTypes);
const PostBoost = require("@models/PostBoost")(sequelize, DataTypes);

/* =========================
   RELATIONS
========================= */

/* --- Pricing - User --- */
Pricing.hasMany(User, { foreignKey: "idPricing" });
User.belongsTo(Pricing, { foreignKey: "idPricing" });

/* --- User - Post --- */
User.hasMany(Post, { foreignKey: "idUser" });
Post.belongsTo(User, { foreignKey: "idUser" });

/* --- Wishlist --- */
User.hasMany(Wishlist, { foreignKey: "idUser" });
Wishlist.belongsTo(User, { foreignKey: "idUser" });

Post.hasMany(Wishlist, { foreignKey: "idPost" });
Wishlist.belongsTo(Post, { foreignKey: "idPost" });

/* --- Comment --- */
Post.hasMany(Comment, { foreignKey: "idPost" });
Comment.belongsTo(Post, { foreignKey: "idPost" });

User.hasMany(Comment, { foreignKey: "idUser" });
Comment.belongsTo(User, { foreignKey: "idUser" });

/* --- Rating --- */
Post.hasMany(Rating, { foreignKey: "idPost" });
Rating.belongsTo(Post, { foreignKey: "idPost" });

User.hasMany(Rating, { foreignKey: "idUser" });
Rating.belongsTo(User, { foreignKey: "idUser" });

/* --- Post - Tag (many to many) --- */
Post.belongsToMany(Tag, {
  through: TagPost,
  foreignKey: "idPost",
});
Tag.belongsToMany(Post, {
  through: TagPost,
  foreignKey: "idTag",
});

Post.hasMany(PostImage, {
  foreignKey: "idPost",
  sourceKey: "idPost",
  as: "images",
});
PostImage.belongsTo(Post, { foreignKey: "idPost", targetKey: "idPost" });
// Conversation - Message
Conversation.hasMany(Message, {
  foreignKey: "idConversation",
  as: "messages",
});

Message.belongsTo(Conversation, {
  foreignKey: "idConversation",
});

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "Sender",
});

User.hasMany(Message, {
  foreignKey: "senderId",
  as: "SentMessages",
});

Conversation.belongsTo(User, {
  foreignKey: "idUser1",
  as: "User1",
});

Conversation.belongsTo(User, {
  foreignKey: "idUser2",
  as: "User2",
});

User.hasMany(Conversation, {
  foreignKey: "idUser1",
  as: "Conversations1",
});

User.hasMany(Conversation, {
  foreignKey: "idUser2",
  as: "Conversations2",
});

User.hasMany(Notification, {
  foreignKey: "idUser",
});

Notification.belongsTo(User, {
  foreignKey: "idUser",
});

Post.belongsTo(User, {
  foreignKey: "approvedBy",
  as: "ApprovedAdmin",
});

User.hasMany(Post, {
  foreignKey: "approvedBy",
  as: "ApprovedPosts",
});
// post boost
Post.hasMany(PostBoost, { foreignKey: "idPost" });
PostBoost.belongsTo(Post, { foreignKey: "idPost" });

Pricing.hasMany(PostBoost, { foreignKey: "idPricing" });
PostBoost.belongsTo(Pricing, { foreignKey: "idPricing" });

Post.belongsTo(Pricing, { foreignKey: "pricingId" });


module.exports = {
  sequelize,
  User,
  Pricing,
  Post,
  Wishlist,
  Comment,
  Rating,
  Tag,
  TagPost,
  PostImage,
  Notification,
  Conversation,
  Message,
  Transaction,
  PostBoost,
};
