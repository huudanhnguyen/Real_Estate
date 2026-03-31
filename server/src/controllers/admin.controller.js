const AdminService = require("@services/admin.service");
const asyncHandler = require("@utils/asyncHandler");

const AdminController = {
  // GET ALL USERS (search + pagination)
  getUsers: asyncHandler(async (req, res) => {
    const result = await AdminService.getUsers({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
    });

    res.json(result);
  }),

  // GET USER DETAIL
  getUserDetail: asyncHandler(async (req, res) => {
    const user = await AdminService.getUserDetail(req.params.id);
    res.json({ user });
  }),

  // UPDATE ROLE
  updateUserRole: asyncHandler(async (req, res) => {
    const { role } = req.body;

    const result = await AdminService.updateUserRole(
      req.params.id,
      role,
      req.user.id,
    );

    res.json({
      message: "Cập nhật role thành công",
      role: result.role,
    });
  }),

  // UPDATE AVATAR
  updateUserAvatar: asyncHandler(async (req, res) => {
    const url = await AdminService.updateUserAvatar(req.params.id, req.file);

    res.json({
      message: "Cập nhật avatar thành công",
      url,
    });
  }),

  // DELETE USER
  deleteUser: asyncHandler(async (req, res) => {
    await AdminService.deleteUser(req.params.id);
    res.json({ message: "Xoá user thành công" });
  }),

  // TOGGLE LOCK
  toggleUserLock: asyncHandler(async (req, res) => {
    const result = await AdminService.toggleUserLock(
      req.params.id,
      req.user.id,
    );

    res.json({
      message: result.isLocked
        ? "Khoá tài khoản thành công"
        : "Mở khoá tài khoản thành công",
      isLocked: result.isLocked,
    });
  }),
};

module.exports = AdminController;
