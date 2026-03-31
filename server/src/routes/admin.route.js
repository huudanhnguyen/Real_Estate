const express = require("express");
const router = express.Router();

const verifyToken = require("@middlewares/auth.middleware");
const verifyAdmin = require("@middlewares/verifyAdmin.middleware");

const AdminController = require("@controllers/admin.controller");
const AdminPostController = require("@controllers/admin.post.controller");
const AdminTagController = require("@controllers/admin.tag.controller");
const AdminDashboardController = require("@controllers/adminDashboard.controller");
const upload = require("@middlewares/upload.middleware");

/* =========================
   GLOBAL ADMIN MIDDLEWARE
========================= */
router.use(verifyToken, verifyAdmin);

/* =========================
   USER MANAGEMENT
========================= */
router.get("/users", AdminController.getUsers);
router.get("/users/:id", AdminController.getUserDetail);
router.patch("/users/:id/role", AdminController.updateUserRole);
router.patch(
  "/users/:id/avatar",
  upload.single("avatar"),
  AdminController.updateUserAvatar
);
router.patch("/users/:id/lock", AdminController.toggleUserLock);
router.delete("/users/:id", AdminController.deleteUser);



router.get("/posts", AdminPostController.getPosts);

router.patch("/posts/:idPost/approve", AdminPostController.approvePost);

router.patch("/posts/:idPost/reject", AdminPostController.rejectPost);
router.get("/posts/:idPost", AdminPostController.getPostDetail);

router.delete("/posts/:idPost", AdminPostController.deletePost);
// TAGS
router.get("/tags", AdminTagController.getTags);
router.post("/tags", AdminTagController.createTag);
router.delete("/tags/:id", AdminTagController.deleteTag);
// DASHBOARD
router.get("/dashboard", AdminDashboardController.getDashboard);



module.exports = router;
