const { Post, User, PostImage } = require("@models");
const { Op } = require("sequelize");

const AdminPostService = {
  // GET POSTS WITH FILTER / SEARCH / PAGINATION
  getPosts: async (query = {}) => {
    const {
      search,
      status,
      userId,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = query;

    const where = {};

    // 🔍 Search theo title
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }

    // 🟡 Filter theo trạng thái duyệt
    if (status) {
      where.moderationStatus = status;
    }

    // 👤 Filter theo người đăng
    if (userId) {
      where.idUser = userId;
    }

    // 📅 Filter theo ngày tạo
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) where.createdAt[Op.lte] = new Date(toDate);
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Post.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset,
      distinct: true,
      include: [
        {
          model: User,
          attributes: ["id", "email", "fullName"],
        },
        {
          model: User,
          as: "ApprovedAdmin",
          attributes: ["id", "fullName"],
        },
        {
          model: PostImage,
          as: "images",
          attributes: ["url", "isPrimary", "sortOrder"],
          separate: true,
          order: [["sortOrder", "ASC"]],
        },
      ],
    });

    return {
      data: rows,
      pagination: {
        page: +page,
        limit: +limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  // APPROVE POST
  approvePost: async (idPost, adminId) => {
    const post = await Post.findByPk(idPost);
    if (!post) throw new Error("Bài đăng không tồn tại");

    if (post.moderationStatus === "approved") {
      throw new Error("Bài đăng đã được duyệt");
    }

    await post.update({
      moderationStatus: "approved",
      approvedAt: new Date(),
      approvedBy: adminId,
      rejectedReason: null,
    });

    return post;
  },

  // REJECT POST
  rejectPost: async (idPost, adminId, reason) => {
    const post = await Post.findByPk(idPost);
    if (!post) throw new Error("Bài đăng không tồn tại");

    await post.update({
      moderationStatus: "rejected",
      approvedAt: null,
      approvedBy: adminId,
      rejectedReason: reason || "Không đạt yêu cầu",
    });

    return post;
  },
  getPostDetail: async (idPost) => {
    const post = await Post.findOne({
      where: {
        idPost,
        moderationStatus: "approved",
      },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: PostImage,
          as: "images",
          attributes: ["url", "isPrimary", "sortOrder"],
          separate: true,
          order: [["sortOrder", "ASC"]],
        },
        {
          model: Tag,
          through: { attributes: [] },
        },
      ],
    });

    if (!post) throw new Error("Post không tồn tại");

    return post;
  },

  // DELETE POST
  deletePost: async (idPost) => {
    const post = await Post.findByPk(idPost);
    if (!post) throw new Error("Bài đăng không tồn tại");

    await post.destroy();
    return true;
  },
};

module.exports = AdminPostService;
