const UploadService = require("@services/upload.service");

const UploadController = {
  // =====================================
  // UPLOAD IMAGES FOR A POST
  // =====================================
  uploadPostImages: async (req, res) => {
    try {
      const { idPost } = req.params;
      const userId = req.user?.id; 

      if (!Array.isArray(req.files) || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "Không có file nào được upload" });
      }

      const images = await UploadService.uploadImagesByPost(
        idPost,
        userId,
        req.files
      );

      res.json({
        message: "Upload ảnh thành công",
        images,
      });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(400).json({ message: err.message || "Upload thất bại" });
    }
  },

  // =====================================
  // DELETE ONE IMAGE
  // =====================================
  deleteImage: async (req, res) => {
    try {
      const { imageId } = req.params;
      const userId = req.user.id;

      const result = await UploadService.deleteImage(imageId, userId);

      res.json({
        message: "Xoá ảnh thành công",
        result,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // =====================================
  // SET PRIMARY IMAGE
  // =====================================
  setPrimaryImage: async (req, res) => {
    try {
      const { imageId } = req.params;
      const userId = req.user.id;

      const result = await UploadService.setPrimaryImage(imageId, userId);

      res.json({
        message: "Đặt ảnh đại diện thành công",
        result,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

module.exports = UploadController;
