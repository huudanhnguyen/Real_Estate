const AdminPostService = require("@services/admin.post.service");
const asyncHandler = require("@utils/asyncHandler");

const AdminPostController = {
  // GET POSTS (FILTER / SEARCH / PAGINATION)
  getPosts: asyncHandler(async (req, res) => {
    const result = await AdminPostService.getPosts(req.query);
    res.json(result);
  }),

  // APPROVE POST
  approvePost: asyncHandler(async (req, res) => {
    const post = await AdminPostService.approvePost(
      req.params.idPost,
      req.user.id,
    );
    res.json({ message: "Duyệt bài thành công", post });
  }),

  // REJECT POST
  rejectPost: asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const post = await AdminPostService.rejectPost(
      req.params.idPost,
      req.user.id,
      reason,
    );
    res.json({ message: "Từ chối bài đăng", post });
  }),
  // GET POST DETAIL
  getPostDetail: asyncHandler(async (req, res) => {
    const post = await PostService.getPostDetail(req.params.idPost);
    res.json({ post });
  }),

  // DELETE POST
  deletePost: asyncHandler(async (req, res) => {
    await AdminPostService.deletePost(req.params.idPost);
    res.json({ message: "Xoá bài đăng thành công" });
  }),
};

module.exports = AdminPostController;
