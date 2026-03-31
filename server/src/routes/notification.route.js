const express = require("express");
const router = express.Router();

const NotificationController = require("@controllers/notification.controller");
const authMiddleware = require("@middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", NotificationController.getMyNotifications);

router.get("/unread/count", NotificationController.countUnread);

router.patch("/:id/read", NotificationController.markAsRead);

router.patch("/read-all", NotificationController.markAllAsRead);

module.exports = router;
