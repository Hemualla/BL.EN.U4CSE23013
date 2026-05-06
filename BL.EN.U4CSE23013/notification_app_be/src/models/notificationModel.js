const { generateId, getCurrentTimestamp } = require("../utils/helpers");

// Using in-memory storage since no database is required for this assessment
let notifications = [];

class Notification {
  constructor(title, message, type = "info") {
    this.id = generateId();
    this.title = title;
    this.message = message;
    this.type = type; // info | warning | error | success
    this.isRead = false;
    this.createdAt = getCurrentTimestamp();
  }
}

const NotificationModel = {
  getAll() {
    // return a copy so the internal array isn't mutated from outside
    return [...notifications];
  },

  getById(id) {
    return notifications.find((n) => n.id === id) || null;
  },

  create(title, message, type) {
    const newNotification = new Notification(title, message, type);
    notifications.push(newNotification);
    return newNotification;
  },

  update(id, updates) {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return null;

    notifications[index] = { ...notifications[index], ...updates };
    return notifications[index];
  },

  markAsRead(id) {
    return NotificationModel.update(id, { isRead: true });
  },

  delete(id) {
    const index = notifications.findIndex((n) => n.id === id);
    if (index === -1) return false;

    notifications.splice(index, 1);
    return true;
  },
};

module.exports = NotificationModel;
