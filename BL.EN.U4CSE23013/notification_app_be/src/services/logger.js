const axios = require("axios");

// Auth token obtained after calling the /evaluation-service/auth endpoint
// Set this in your .env file as LOG_AUTH_TOKEN
const getToken = () => process.env.LOG_AUTH_TOKEN || "";

/**
 * Sends a structured log to the evaluation server.
 * @param {string} stack - "backend" or "frontend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - package name like "controller", "service", "middleware", etc.
 * @param {string} message - what happened
 */
const Log = async (stack, level, pkg, message) => {
  const token = getToken();

  if (!token) {
    console.warn("[Logger] No auth token set. Skipping log.");
    return;
  }

  try {
    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`[Logger] Log sent — ${level.toUpperCase()} | ${pkg} | ID: ${response.data?.logID}`);
  } catch (err) {
    // logging should never crash the app
    console.error(`[Logger] Could not send log: ${err.message}`);
  }
};

module.exports = Log;
