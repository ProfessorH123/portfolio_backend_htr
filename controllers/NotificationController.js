// controllers/NotificatonController.js
const User = require("../models/user");
const Notification = require("../models/notification");

// GET NOTIFICATIONS BY USER ID
const getNotificationByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User with ${userId} not found`);
    }
    const notifications = await Notification.find({ user: userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SEND NOTIFICATIONS TO ALL USERS
const sendNotificationToAllUsers = async (req, res) => {
  const { message } = req.body;

  try {
    const Users = await User.find({});

    for (let i = 0; i < Users.length; i++) {
      const notification = new Notification({
        user: Users[i],
        message: message,
      });

      await notification.save();
    }

    res.status(200).json(`Notification sent to all users`);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while senting notifications." });
  }
};

// MARK NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany({ user: userId }, { isRead: true });

    res
      .status(200)
      .json({ message: "All notifications marked as read for the user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// DELETE ALL NOTIFICATIONS BY USER ID
const deleteNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.deleteMany({ user: userId });
    res
      .status(200)
      .json({ message: "All your notifications deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  getNotificationByUserId,
  sendNotificationToAllUsers,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationsByUser,
};
