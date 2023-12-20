const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");

router.get(
  "/NotificationByUserId/:userId",
  NotificationController.getNotificationByUserId
);
router.post(
  "/SendNotifications",
  NotificationController.sendNotificationToAllUsers
);

router.put(
  "/:notificationId/read",
  NotificationController.markNotificationAsRead
);
router.put(
  "/MarkAllAsRead/:userId",
  NotificationController.markAllNotificationsAsRead
);
router.delete(
  "/DeleteAll/:userId",
  NotificationController.deleteNotificationsByUser
);

module.exports = router;
