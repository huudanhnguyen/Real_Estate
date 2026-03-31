const { Dropbox } = require("dropbox");
const fetch = require("node-fetch");
const { Post, PostImage, User } = require("@models");
const { getDropboxAccessToken } = require("@utils/dropbox");

const UploadService = {
  // =====================================================================
  // UPLOAD IMAGES FOR POSTS (Temporary link – luôn load được)
  // =====================================================================
  uploadImagesByPost: async (idPost, userId, files) => {
    const accessToken = await getDropboxAccessToken();
    const dbx = new Dropbox({ accessToken, fetch });

    const post = await Post.findOne({ where: { idPost } });
    if (!post) throw new Error("Không tìm thấy bài đăng");
    if (post.idUser !== userId)
      throw new Error("Bạn không có quyền upload ảnh cho bài đăng này");

    const urls = [];
    const count = await PostImage.count({ where: { idPost } });
    let sortOrder = count;

    for (const file of files) {
      try {
        if (!file || !file.buffer) throw new Error("File upload lỗi");

        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `/posts/${idPost}/${fileName}`;

        // Upload lên Dropbox
        await dbx.filesUpload({
          path: filePath,
          contents: file.buffer,
          mode: "add",
        });

        // Temporary link
        const temp = await dbx.filesGetTemporaryLink({ path: filePath });

        const url = temp.result.link;

        const image = await PostImage.create({
          idPost,
          url,
          path: filePath,
          isPrimary: false,
          sortOrder: sortOrder++,
        });

        urls.push({
          idImage: image.id,
          url,
        });
      } catch (err) {
        console.error("UPLOAD IMG ERROR:", err.message);
      }
    }

    return urls;
  },

  // =====================================================================
  // DELETE POST IMAGE
  // =====================================================================
  deleteImage: async (imageId, userId) => {
    const accessToken = await getDropboxAccessToken();
    const dbx = new Dropbox({ accessToken, fetch });

    const image = await PostImage.findByPk(imageId, {
      include: [{ model: Post }],
    });

    if (!image) throw new Error("Ảnh không tồn tại");
    if (image.Post.idUser !== userId) throw new Error("Bạn không có quyền xoá");

    await dbx.filesDeleteV2({ path: image.path });
    await image.destroy();

    return { success: true };
  },

  // =====================================================================
  // SET PRIMARY IMAGE
  // =====================================================================
  setPrimaryImage: async (imageId, userId) => {
    const image = await PostImage.findByPk(imageId, {
      include: [{ model: Post }],
    });

    if (!image) throw new Error("Ảnh không tồn tại");
    if (image.Post.idUser !== userId)
      throw new Error("Bạn không có quyền chỉnh sửa");

    await PostImage.update(
      { isPrimary: false },
      { where: { idPost: image.idPost } }
    );

    image.isPrimary = true;
    await image.save();

    return { success: true };
  },

  // =====================================================================
  // UPLOAD USER AVATAR (Temporary link – load 100%)
  // =====================================================================
  uploadAvatar: async (userId, file) => {
    if (!file) throw new Error("File không hợp lệ");

    const accessToken = await getDropboxAccessToken();
    const dbx = new Dropbox({ accessToken, fetch });

    const user = await User.findByPk(userId);
    if (!user) throw new Error("User không tồn tại");

    // Xoá avatar cũ nếu có
    if (user.avatarPath) {
      try {
        await dbx.filesDeleteV2({ path: user.avatarPath });
      } catch (err) {
        console.log("Lỗi xoá avatar cũ:", err.message);
      }
    }

    const fileName = `avatar_${Date.now()}.jpg`;
    const filePath = `/users/${userId}/${fileName}`;

    await dbx.filesUpload({
      path: filePath,
      contents: file.buffer,
      mode: "overwrite",
    });

    // Lấy temporary link (FE luôn load được)
    const temp = await dbx.filesGetTemporaryLink({ path: filePath });

    const avatarUrl = temp.result.link;

    // Lưu avatar + path thật để xoá file sau này
    user.avatar = avatarUrl;
    user.avatarPath = filePath;
    await user.save();

    return avatarUrl;
  },

  // =====================================================================
  // DEPRECATED – KHÔNG DÙNG NỮA
  // =====================================================================
  deleteFileByUrl: async () => {
    console.log(
      "deleteFileByUrl hiện không sử dụng nữa. Dùng filePath thay thế."
    );
    return false;
  },
};

module.exports = UploadService;
