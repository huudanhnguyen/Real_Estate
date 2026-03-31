require("module-alias/register");
require("dotenv").config();

const {
  sequelize,
  Tag,
  Pricing,
  User,
  Post,
  TagPost,
  PostImage,
  Wishlist,
  Comment,
  Rating,
} = require("@models");

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

async function resetFull() {
  try {
    console.log("🔄 DROP toàn bộ bảng...");
    await sequelize.drop();
    console.log("✔️ DROP xong.");

    console.log("🔧 SYNC database...");
    await sequelize.sync({ force: true });
    console.log("✔️ SYNC xong.");

    // ======================================================
    // 1) TAGS
    // ======================================================
    console.log("🌱 Seeding TAGS...");

    const tagsList = [
      "Căn góc",
      "Gần trung tâm",
      "Sổ hồng",
      "Nội thất đẹp",
      "View đẹp",
      "Mặt tiền",
      "Đường lớn",
      "Full nội thất",
      "Nhà mới",
      "Chung cư",
    ];

    const tagRecords = [];

    for (const name of tagsList) {
      const t = await Tag.create({ name }); // ✅ ĐÚNG FIELD
      tagRecords.push(t);
    }

    console.log("✔️ TAGS OK");

    // ======================================================
    // 2) PRICING
    // ======================================================
    console.log("🌱 Seeding PRICING...");

    await Pricing.bulkCreate([
      {
        name: "Gói thường",
        isShowDescription: true,
        priority: 1,
        requireScore: 0,
        price: 0,
        expiredDay: 7,
      },
      {
        name: "Gói VIP",
        isShowDescription: true,
        priority: 10,
        requireScore: 100,
        price: 50000,
        expiredDay: 30,
      },
      {
        name: "Gói VIP đặc biệt",
        isShowDescription: true,
        priority: 20,
        requireScore: 500,
        price: 150000,
        expiredDay: 45,
      },
    ]);

    console.log("✔️ PRICING OK");

    // ======================================================
    // 3) ADMIN USER
    // ======================================================
    console.log("🌱 Seeding ADMIN USER...");

    const adminPass = await bcrypt.hash("123456", 10);

    const adminUser = await User.create({
      fullName: "Admin",
      email: "admin@gmail.com",
      password: adminPass,
      phone: "0123456789",
      role: "admin",
      idPricing: 1,
      emailVerified: true,
      phoneVerified: true,
    });

    console.log("✔️ Admin (email: admin@gmail.com | pass: 123456)");

    // ======================================================
    // 4) POSTS + TAGPOST
    // ======================================================
    console.log("🌱 Seeding POSTS...");

    const tagIds = tagRecords.map((t) => t.id);

    const postsData = [
      {
        title: "Nhà mặt tiền Quận 1, vị trí đẹp",
        address: "12 Lê Lợi",
        province: "TP Hồ Chí Minh",
        district: "Quận 1",
        ward: "Bến Nghé",
        price: 12500000000,
        size: 80,
        floor: 3,
        bedroom: 4,
        bathroom: 3,
        listingType: "Bán",
        propertyType: "Nhà mặt phố",
        direction: "Đông",
        balonDirection: "Đông",
        description: "Nhà đẹp trung tâm quận 1, gần chợ Bến Thành.",
      },
      {
        title: "Chung cư Vinhomes Central Park, view sông",
        address: "208 Nguyễn Hữu Cảnh",
        province: "TP Hồ Chí Minh",
        district: "Bình Thạnh",
        ward: "Phường 22",
        price: 4200000000,
        size: 62,
        floor: 20,
        bedroom: 2,
        bathroom: 2,
        listingType: "Bán",
        propertyType: "Căn hộ chung cư",
        direction: "Nam",
        balonDirection: "Nam",
        description: "Căn hộ full nội thất, view đẹp, an ninh 24/7.",
      },
      {
        title: "Nhà phố Gò Vấp, hẻm xe hơi",
        address: "55 Quang Trung",
        province: "TP Hồ Chí Minh",
        district: "Gò Vấp",
        ward: "Phường 11",
        price: 3500000000,
        size: 45,
        floor: 2,
        bedroom: 3,
        bathroom: 2,
        listingType: "Bán",
        propertyType: "Nhà riêng",
        direction: "Bắc",
        balonDirection: "Bắc",
        description: "Nhà mới xây, dọn vào ở ngay.",
      },
      {
        title: "Chung cư Sunrise City, full nội thất",
        address: "23 Nguyễn Hữu Thọ",
        province: "TP Hồ Chí Minh",
        district: "Quận 7",
        ward: "Tân Hưng",
        price: 3000000000,
        size: 72,
        floor: 12,
        bedroom: 2,
        bathroom: 2,
        listingType: "Cho thuê",
        propertyType: "Căn hộ chung cư",
        direction: "Tây",
        balonDirection: "Tây",
        description: "Căn hộ tiện nghi, gần Lotte Mart Quận 7.",
      },
      {
        title: "Biệt thự Thảo Điền, hồ bơi riêng",
        address: "50 Nguyễn Văn Hưởng",
        province: "TP Hồ Chí Minh",
        district: "Thủ Đức",
        ward: "Thảo Điền",
        price: 35000000000,
        size: 320,
        floor: 2,
        bedroom: 5,
        bathroom: 5,
        listingType: "Bán",
        propertyType: "Biệt thự",
        direction: "Đông - Bắc",
        balonDirection: "Đông - Bắc",
        description: "Biệt thự sang trọng, khu dân cư cao cấp.",
      },
      {
        title: "Nhà trọ Quận 10, gần bệnh viện Nhi Đồng",
        address: "45 Lý Thái Tổ",
        province: "TP Hồ Chí Minh",
        district: "Quận 10",
        ward: "Phường 10",
        price: 5500000,
        size: 18,
        floor: 1,
        bedroom: 1,
        bathroom: 1,
        listingType: "Cho thuê",
        propertyType: "Nhà riêng",
        direction: "Tây - Nam",
        balonDirection: "Tây - Nam",
        description: "Phòng sạch sẽ, an ninh tốt.",
      },
      {
        title: "Đất nền Bình Chánh, sổ riêng từng nền",
        address: "Đường Vĩnh Lộc",
        province: "TP Hồ Chí Minh",
        district: "Bình Chánh",
        ward: "Vĩnh Lộc A",
        price: 1500000000,
        size: 100,
        floor: 0,
        bedroom: 0,
        bathroom: 0,
        listingType: "Bán",
        propertyType: "Đất nền",
        direction: "Nam",
        balonDirection: "Nam",
        description: "Đất đẹp vuông vức, khu dân cư đông đúc.",
      },
      {
        title: "Kho xưởng Hóc Môn, diện tích lớn",
        address: "QL 22",
        province: "TP Hồ Chí Minh",
        district: "Hóc Môn",
        ward: "Bà Điểm",
        price: 25000000000,
        size: 1000,
        floor: 1,
        bedroom: 0,
        bathroom: 1,
        listingType: "Cho thuê",
        propertyType: "Kho",
        direction: "Tây - Bắc",
        balonDirection: "Tây - Bắc",
        description: "Kho lớn phù hợp sản xuất và chứa hàng.",
      },
      {
        title: "Nhà phố Tân Bình, gần sân bay",
        address: "35 Cộng Hòa",
        province: "TP Hồ Chí Minh",
        district: "Tân Bình",
        ward: "4",
        price: 6800000000,
        size: 70,
        floor: 3,
        bedroom: 4,
        bathroom: 3,
        listingType: "Bán",
        propertyType: "Nhà phố thương mại",
        direction: "Đông - Nam",
        balonDirection: "Đông - Nam",
        description: "Nhà đẹp, khu vực kinh doanh sầm uất.",
      },
      {
        title: "Căn hộ Masteri Thảo Điền, view hồ",
        address: "159 Xa Lộ Hà Nội",
        province: "TP Hồ Chí Minh",
        district: "Thủ Đức",
        ward: "An Phú",
        price: 5200000000,
        size: 68,
        floor: 18,
        bedroom: 2,
        bathroom: 2,
        listingType: "Bán",
        propertyType: "Căn hộ chung cư",
        direction: "Bắc",
        balonDirection: "Bắc",
        description: "Nội thất cao cấp, view hồ bơi cực chill.",
      },
    ];

    const postRecords = [];

    for (const p of postsData) {
      const idPost = uuidv4();

      const newPost = await Post.create({
        idPost,
        ...p,
        idUser: adminUser.id,
        verified: true,
        moderationStatus: "approved",
      });

      postRecords.push(newPost);

      const randomTags = tagIds.sort(() => 0.5 - Math.random()).slice(0, 2);

      for (const tagId of randomTags) {
        await TagPost.create({
          idPost: newPost.idPost,
          idTag: tagId,
        });
      }
    }

    console.log("✔️ POSTS + TAGPOST OK");

    // ======================================================
    // 5) POST IMAGES
    // ======================================================
    console.log("🌱 Seeding POST IMAGES...");

    const placeholderImages = [
      "https://placehold.co/600x400?text=Image1",
      "https://placehold.co/600x400?text=Image2",
      "https://placehold.co/600x400?text=Image3",
    ];

    for (const post of postRecords) {
      let order = 0;
      for (const img of placeholderImages) {
        await PostImage.create({
          idPost: post.idPost,
          url: img, // 🔥 KHÔNG NULL
          path: img, // 🔥 KHÔNG NULL (dùng tạm url làm path)
          isPrimary: order === 0,
          sortOrder: order,
        });
        order++;
      }
    }

    console.log("✔️ POST IMAGES OK");

    // ======================================================
    // 6) WISHLIST
    // ======================================================
    console.log("🌱 Seeding WISHLIST...");

    for (const post of postRecords) {
      await Wishlist.create({
        idUser: adminUser.id,
        idPost: post.idPost,
      });
    }

    console.log("✔️ WISHLIST OK");

    // ======================================================
    // 7) COMMENTS
    // ======================================================
    console.log("🌱 Seeding COMMENTS...");

    for (const post of postRecords) {
      await Comment.create({
        idUser: adminUser.id,
        idPost: post.idPost,
        content: "Bài viết rất hữu ích!",
      });
    }

    console.log("✔️ COMMENTS OK");

    // ======================================================
    // 8) RATINGS
    // ======================================================
    console.log("🌱 Seeding RATINGS...");

    for (const post of postRecords) {
      await Rating.create({
        idUser: adminUser.id,
        idPost: post.idPost,
        star: Math.floor(Math.random() * 5) + 1,
        content: "Chất lượng bài đăng tốt.",
      });
    }

    console.log("✔️ RATINGS OK");

    console.log("🎉 RESET & SEED FULL HOÀN TẤT!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi reset-full:", err);
    process.exit(1);
  }
}

resetFull();
