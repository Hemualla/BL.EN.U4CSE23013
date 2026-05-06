const crypto = require("crypto");

/**
 * Generates a simple unique ID using crypto randomUUID if available,
 * otherwise falls back to a timestamp-based approach.
 */
const generateId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Returns the current time as an ISO string.
 */
const getCurrentTimestamp = () => new Date().toISOString();

/**
 * Checks if a string is non-empty after trimming.
 */
const isNonEmpty = (val) => typeof val === "string" && val.trim().length > 0;

/**
 * Validates the notification type field.
 */
const isValidType = (type) => {
  const allowed = ["info", "warning", "error", "success"];
  return allowed.includes(type);
};

module.exports = { generateId, getCurrentTimestamp, isNonEmpty, isValidType };
