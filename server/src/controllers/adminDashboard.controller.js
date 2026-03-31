const AdminDashboardService = require("@services/adminDashboard.service");
const asyncHandler = require("@utils/asyncHandler");

const AdminDashboardController = {
  getDashboard: asyncHandler(async (req, res) => {
    const stats = await AdminDashboardService.getStats();

    res.json(stats);
  }),
};

module.exports = AdminDashboardController;
