const express = require("express");
const router = express.Router();

const {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
} = require("../controllers/controller");

// Notification CRUD routes
router.get("/notifications", getAllNotifications);
router.post("/notifications", createNotification);
router.put("/notifications/:id", updateNotification);
router.delete("/notifications/:id", deleteNotification);
router.patch("/notifications/:id/read", markAsRead);

module.exports = router;
