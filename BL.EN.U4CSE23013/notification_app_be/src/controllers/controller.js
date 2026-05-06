const NotificationModel = require("../models/notificationModel");
const Log = require("../services/logger");
const { isNonEmpty, isValidType } = require("../utils/helpers");

// GET /api/notifications
const getAllNotifications = async (req, res) => {
  try {
    const data = NotificationModel.getAll();
    await Log("backend", "info", "controller", `Fetched ${data.length} notifications`);
    res.status(200).json({ success: true, data });
  } catch (err) {
    await Log("backend", "error", "handler", `Failed to fetch notifications: ${err.message}`);
    res.status(500).json({ success: false, message: "Could not retrieve notifications" });
  }
};

// POST /api/notifications
const createNotification = async (req, res) => {
  const { title, message, type = "info" } = req.body;

  if (!isNonEmpty(title) || !isNonEmpty(message)) {
    await Log("backend", "warn", "handler", "Create notification failed — missing title or message");
    return res.status(400).json({ success: false, message: "Title and message are required" });
  }

  if (!isValidType(type)) {
    await Log("backend", "warn", "handler", `Invalid notification type received: ${type}`);
    return res.status(400).json({ success: false, message: "Type must be info, warning, error, or success" });
  }

  try {
    const notification = NotificationModel.create(title.trim(), message.trim(), type);
    await Log("backend", "info", "controller", `New notification created — ID: ${notification.id}, type: ${type}`);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    await Log("backend", "error", "handler", `Error creating notification: ${err.message}`);
    res.status(500).json({ success: false, message: "Failed to create notification" });
  }
};

// PUT /api/notifications/:id
const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { title, message, type } = req.body;

  const existing = NotificationModel.getById(id);
  if (!existing) {
    await Log("backend", "warn", "handler", `Update failed — notification not found: ${id}`);
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  const updates = {};
  if (isNonEmpty(title)) updates.title = title.trim();
  if (isNonEmpty(message)) updates.message = message.trim();
  if (type && isValidType(type)) updates.type = type;

  try {
    const updated = NotificationModel.update(id, updates);
    await Log("backend", "info", "controller", `Notification updated — ID: ${id}`);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    await Log("backend", "error", "handler", `Error updating notification ${id}: ${err.message}`);
    res.status(500).json({ success: false, message: "Failed to update notification" });
  }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  const { id } = req.params;

  const existing = NotificationModel.getById(id);
  if (!existing) {
    await Log("backend", "warn", "handler", `Delete failed — notification not found: ${id}`);
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  try {
    NotificationModel.delete(id);
    await Log("backend", "info", "controller", `Notification deleted — ID: ${id}`);
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    await Log("backend", "error", "handler", `Error deleting notification ${id}: ${err.message}`);
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  const { id } = req.params;

  const existing = NotificationModel.getById(id);
  if (!existing) {
    await Log("backend", "warn", "handler", `Mark-read failed — notification not found: ${id}`);
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  try {
    const updated = NotificationModel.markAsRead(id);
    await Log("backend", "info", "controller", `Notification marked as read — ID: ${id}`);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    await Log("backend", "error", "handler", `Error marking notification as read ${id}: ${err.message}`);
    res.status(500).json({ success: false, message: "Failed to mark notification as read" });
  }
};

module.exports = {
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  markAsRead,
};
