const {
  Post,
  Tag,
  TagPost,
  User,
  PostImage,
  PostBoost,
  Pricing,
} = require("@models");
const { v4: uuidv4 } = require("uuid");
const { Op, literal } = require("sequelize");
const { getDropboxAccessToken } = require("@utils/dropbox");
const {
  getProvinceName,
  getDistrictName,
  getWardName,
} = require("../utils/location.helper");

const { Dropbox } = require("dropbox");
const fetch = require("node-fetch");

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_REFRESH_TOKEN,
  fetch,
});

const PostService = {
  createPost: async (userId, body) => {
    const {
      title,
      price,
      address,
      province,
      district,
      ward,
      size,
      floor,
      bedroom,
      bathroom,
      listingType,
      propertyType,
      direction,
      balonDirection,
      description,
      tags,
      isNegotiable,
      isFurniture,
    } = body;

    if (!title || !address) {
      throw new Error("Thiếu dữ liệu bắt buộc");
    }

    if (!listingType || !propertyType) {
      throw new Error("Thiếu loại giao dịch hoặc loại BĐS");
    }

    let provinceName = province;
    let districtName = district;
    let wardName = ward;

    try {
      provinceName = await getProvinceName(province);
      districtName = await getDistrictName(district);
      wardName = await getWardName(ward, district);
    } catch (err) {
      console.warn("⚠️ Location API failed, fallback to raw value");
    }

    console.log("CREATE POST LOCATION:", {
      province,
      district,
      ward,
      provinceName,
      districtName,
      wardName,
    });

    const idPost = uuidv4();

    const newPost = await Post.create({
      idPost,
      title,
      price: isNegotiable ? null : price,
      isNegotiable: !!isNegotiable,
      address,
      province: provinceName,
      district: districtName,
      ward: wardName,
      size,
      floor,
      bedroom,
      bathroom,
      isFurniture: !!isFurniture,
      listingType,
      propertyType,
      direction,
      balonDirection,
      description,
      verified: false,
      avgStar: 0,
      idUser: userId,
    });

    // ===============================
    // TAGS
    // ===============================
    if (Array.isArray(tags) && tags.length > 0) {
      const rows = tags.map((tagId) => ({
        idPost: newPost.idPost,
        idTag: tagId,
      }));
      await TagPost.bulkCreate(rows);
    }

    // ===============================
    // RETURN FULL POST
    // ===============================
    return await Post.findOne({
      where: { idPost: newPost.idPost },
      include: [
        { model: Tag },
        { model: User, attributes: ["id", "fullName", "avatar"] },
        { model: PostImage, as: "images" },
      ],
    });
  },

  getAllPosts: async (query) => {
    const {
      page = 1,
      limit = 10,
      province,
      district,
      ward,
      listingType,
      propertyType,
      direction,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      bedroom,
      bathroom,
      keyword,
      sort,
    } = query;

    const where = {};

    // ===== LOCATION =====
    if (province) where.province = province;
    if (district) where.district = district;
    if (ward) where.ward = ward;

    // ===== LISTING TYPE =====
    if (listingType) {
      let lt = listingType.trim();
      if (lt.toLowerCase() === "thue") lt = "Cho thuê";
      if (lt.toLowerCase() === "ban") lt = "Bán";
      where.listingType = lt;
    }

    // ===== PROPERTY TYPE =====
    if (propertyType) where.propertyType = propertyType;

    // ===== DIRECTION =====
    if (direction) where.direction = direction;

    // ===== BEDROOM / BATHROOM =====
    if (bedroom) where.bedroom = Number(bedroom);
    if (bathroom) where.bathroom = Number(bathroom);

    // ===== PRICE RANGE =====
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    // ===== SIZE RANGE =====
    if (minSize || maxSize) {
      where.size = {};
      if (minSize) where.size[Op.gte] = Number(minSize);
      if (maxSize) where.size[Op.lte] = Number(maxSize);
    }

    // ===== KEYWORD SEARCH =====
    if (keyword) {
      const kw = keyword.trim();
      where[Op.or] = [
        { title: { [Op.substring]: kw } },
        { address: { [Op.substring]: kw } },
        { description: { [Op.substring]: kw } },
      ];
    }

    // ===== SORTING (USER CHỌN) =====
    let userOrder = [["createdAt", "DESC"]];
    if (sort === "price_asc") userOrder = [["price", "ASC"]];
    if (sort === "price_desc") userOrder = [["price", "DESC"]];
    if (sort === "size_asc") userOrder = [["size", "ASC"]];
    if (sort === "size_desc") userOrder = [["size", "DESC"]];

    // ===== PAGINATION =====
    const offset = (page - 1) * limit;

    // ===== BOOST SORT (SUBQUERY – FIX LỖI MYSQL) =====
    const boostOrder = literal(`
    (
      SELECT MAX(pb.expiredAt)
      FROM postboosts pb
      WHERE pb.idPost = Post.idPost
        AND pb.expiredAt > NOW()
    )
  `);

    const { rows, count } = await Post.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      distinct: true,

      include: [
        { model: Tag },
        { model: User, attributes: ["id", "fullName", "avatar"] },
        { model: PostImage, as: "images" },

        {
          model: PostBoost,
          required: false,
          where: {
            expiredAt: {
              [Op.gt]: new Date(),
            },
          },
          include: [Pricing],
          order: [["expiredAt", "DESC"]],
          limit: 1,
        },

        {
          model: Pricing,
          required: false,
        },
      ],

      order: [
        [boostOrder, "DESC"],
        [{ model: Pricing }, "priority", "DESC"],
        ...userOrder,
      ],
    });
    const now = new Date();

    const formattedPosts = rows.map((post) => {
      const boost = post.PostBoosts?.[0];

      let isBoosted = false;
      let daysLeft = 0;
      let expiredBoost = null;
      let pricingName = null;

      if (boost) {
        isBoosted = true;
        expiredBoost = boost.expiredAt;
        pricingName = boost.Pricing?.name;

        const diff = new Date(boost.expiredAt) - now;
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      }

      return {
        ...post.toJSON(),
        isBoosted,
        daysLeft,
        expiredBoost,
        pricingName,
      };
    });

    return {
      data: formattedPosts,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  },
  // ===============================
  // GET MY POSTS (FIX BOOST DASHBOARD)
  // ===============================
  getMyPosts: async (userId) => {
    const { rows } = await Post.findAndCountAll({
      where: { idUser: userId },

      include: [
        {
          model: PostImage,
          as: "images",
          attributes: ["url"],
        },

        {
          model: PostBoost,
          required: false,
          include: [Pricing],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    const now = new Date();

    const formattedPosts = rows.map((post) => {
      const boostList = post.PostBoosts || [];

      const boost = boostList.reduce((latest, item) => {
        if (!latest) return item;
        return new Date(item.expiredAt) > new Date(latest.expiredAt)
          ? item
          : latest;
      }, null);

      let isBoosted = false;
      let daysLeft = 0;
      let boostExpiredAt = null;

      if (boost) {
        isBoosted = true;
        boostExpiredAt = boost.expiredAt;

        const diff = new Date(boost.expiredAt) - now;
        daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      }

      return {
        ...post.toJSON(),
        isBoosted,
        daysLeft,
        boostExpiredAt,
        pricingName: boost?.Pricing?.name || null,
      };
    });

    return {
      posts: formattedPosts,
    };
  },

  getPostDetail: async (idPost) => {
    const post = await Post.findOne({
      where: { idPost },
      include: [
        { model: Tag },
        { model: User, attributes: ["id", "fullName", "avatar"] },
        { model: PostImage, as: "images" },

        // ===== BOOST =====
        {
          model: PostBoost,
          required: false,
          where: {
            expiredAt: {
              [Op.gt]: new Date(),
            },
          },
          include: [
            {
              model: Pricing,
            },
          ],
          order: [["expiredAt", "DESC"]],
          limit: 1,
        },
      ],
    });

    if (!post) throw new Error("Không tìm thấy bài đăng!");

    // ===== TRANSFORM DATA FOR FE =====
    const boost = post.PostBoosts?.[0];

    const now = new Date();

    let daysLeft = 0;

    if (boost?.expiredAt) {
      const diff = new Date(boost.expiredAt) - now;
      daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    post.setDataValue("isBoosted", !!boost);
    post.setDataValue("boostExpiredAt", boost?.expiredAt || null);
    post.setDataValue("daysLeft", daysLeft);

    return post;
  },

  updatePost: async (idPost, userId, body) => {
    const post = await Post.findOne({ where: { idPost } });

    if (!post) throw new Error("Bài đăng không tồn tại");
    if (post.idUser !== userId)
      throw new Error("Bạn không có quyền sửa bài này");

    const allowedFields = [
      "title",
      "price",
      "address",
      "province",
      "district",
      "ward",
      "size",
      "floor",
      "bedroom",
      "bathroom",
      "listingType",
      "propertyType",
      "direction",
      "balonDirection",
      "description",
      "status",
      "isNegotiable",
    ];

    // 1. Lấy những trường được phép cập nhật
    const updateData = {};
    if (body.isNegotiable === true) {
      updateData.isNegotiable = true;
      updateData.price = null;
    } else if (body.isNegotiable === false) {
      updateData.isNegotiable = false;
      if (body.price !== undefined) {
        updateData.price = body.price;
      }
    }
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    // 2. Nếu không có field nào hợp lệ -> báo lỗi
    if (Object.keys(updateData).length === 0) {
      throw new Error("Không có dữ liệu để cập nhật");
    }

    // 3. Cập nhật post
    await post.update(updateData);

    // 4. Cập nhật tags nếu gửi lên
    if (Array.isArray(body.tags)) {
      await TagPost.destroy({ where: { idPost } });

      if (body.tags.length > 0) {
        const rows = body.tags.map((tagId) => ({
          idPost,
          idTag: tagId,
        }));
        await TagPost.bulkCreate(rows);
      }
    }

    // 5. Lấy lại post đầy đủ
    const updated = await Post.findOne({
      where: { idPost },
      include: [
        { model: Tag },
        { model: User, attributes: ["id", "fullName", "avatar"] },
        { model: PostImage, as: "images" },
      ],
    });

    return updated;
  },

  deletePost: async (idPost, userId) => {
    const accessToken = await getDropboxAccessToken();
    const dbx = new Dropbox({ accessToken, fetch });

    // 1. Lấy post
    const post = await Post.findOne({ where: { idPost } });
    if (!post) throw new Error("Bài đăng không tồn tại");
    if (post.idUser !== userId)
      throw new Error("Bạn không có quyền xoá bài này");

    // 2. Lấy danh sách ảnh
    const images = await PostImage.findAll({ where: { idPost } });

    // 3. Xoá từng ảnh trong folder
    for (const img of images) {
      try {
        await dbx.filesDeleteV2({ path: img.path });
        console.log("Đã xoá file:", img.path);
      } catch (err) {
        console.log(
          "Không thể xoá file:",
          img.path,
          err?.error?.error_summary || err.message,
        );
      }
    }

    // 4. Xoá folder cha (thường là /posts/{idPost})
    try {
      await dbx.filesDeleteV2({ path: `/posts/${idPost}` });
      console.log("Đã xoá folder:", `/posts/${idPost}`);
    } catch (err) {
      console.log(
        "Không xoá được folder Dropbox:",
        err?.error?.error_summary || err.message,
      );
    }

    // 5. Xoá ảnh trong DB
    await PostImage.destroy({ where: { idPost } });

    // 6. Xoá tags liên kết
    await TagPost.destroy({ where: { idPost } });

    // 7. Xoá post
    await post.destroy();

    return { deleted: true };
  },

  // ============================
  // UPLOAD IMAGES CHO 1 POST
  // ============================
  uploadImages: async (idPost, userId, files) => {
    const post = await Post.findOne({ where: { idPost } });
    if (!post) throw new Error("Bài đăng không tồn tại");
    if (post.idUser !== userId)
      throw new Error("Bạn không có quyền upload ảnh cho bài này");

    if (!files || files.length === 0) {
      throw new Error("Không có file upload");
    }

    const createdImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const dropboxPath = `/posts/${idPost}/${Date.now()}-${file.originalname}`;

      // upload lên Dropbox
      const uploadRes = await dbx.filesUpload({
        path: dropboxPath,
        contents: file.buffer,
      });

      // lấy temporary link (hoặc bạn có thể dùng sharing link)
      const linkRes = await dbx.filesGetTemporaryLink({
        path: uploadRes.result.path_lower,
      });

      const imageUrl = linkRes.result.link;

      const img = await PostImage.create({
        idPost,
        url: imageUrl,
        path: uploadRes.result.path_lower,
        isPrimary: i === 0, // ảnh đầu tiên là primary
        sortOrder: i,
      });

      createdImages.push(img);
    }

    return createdImages;
  },
};

module.exports = PostService;
