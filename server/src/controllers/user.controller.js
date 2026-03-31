const asyncHandler = require("@utils/asyncHandler");
const UserService = require("@services/user.service");
const PostService = require("@services/post.service");

const UserController = {
  getProfile: asyncHandler(async (req, res) => {
    const user = await UserService.getProfileWithWallet(req.user.id);
    return res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await UserService.updateProfile(req.user.id, req.body);
    return res.json({ message: "Cập nhật thành công", user });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await UserService.changePassword(req.user.id, oldPassword, newPassword);
    return res.json({ message: "Đổi mật khẩu thành công" });
  }),

  uploadAvatar: asyncHandler(async (req, res) => {
    const url = await UserService.uploadAvatar(req.user.id, req.file);
    return res.json({ message: "Upload avatar thành công", url });
  }),

  deleteAvatar: asyncHandler(async (req, res) => {
    await UserService.deleteAvatar(req.user.id);
    return res.json({ message: "Xóa avatar thành công" });
  }),

  myPosts: asyncHandler(async (req, res) => {
    const result = await PostService.getMyPosts(req.user.id);

    return res.json({
      message: "Lấy danh sách thành công",
      ...result,
    });
  }),
};

module.exports = UserController;
