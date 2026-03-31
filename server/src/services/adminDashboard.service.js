const { User, Post } = require("@models");

const AdminDashboardService = {
  getStats: async () => {
    const totalUsers = await User.count();

    const totalPosts = await Post.count();

    const pendingPosts = await Post.count({
      where: { moderationStatus: "pending" },
    });

    const approvedPosts = await Post.count({
      where: { moderationStatus: "approved" },
    });

    return {
      totalUsers,
      totalPosts,
      pendingPosts,
      approvedPosts,
    };
  },
};

module.exports = AdminDashboardService;
