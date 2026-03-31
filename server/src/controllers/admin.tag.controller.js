const AdminTagService = require("@services/admin.tag.service");
const asyncHandler = require("@utils/asyncHandler");

const AdminTagController = {
  // GET /admin/tags
  getTags: asyncHandler(async (req, res) => {
    const tags = await AdminTagService.getTags();
    res.json({ tags });
  }),

  // POST /admin/tags
  createTag: asyncHandler(async (req, res) => {
    const { name } = req.body;
    const tag = await AdminTagService.createTag(name);

    res.status(201).json({
      message: "Tạo tag thành công",
      tag,
    });
  }),

  // DELETE /admin/tags/:id
  deleteTag: asyncHandler(async (req, res) => {
    await AdminTagService.deleteTag(req.params.id);

    res.json({
      message: "Xoá tag thành công",
    });
  }),
};

module.exports = AdminTagController;
