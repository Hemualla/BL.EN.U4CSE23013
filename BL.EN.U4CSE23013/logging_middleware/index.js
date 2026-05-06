const axios = require("axios");

// Valid values as per the evaluation server constraints
const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validBackendPackages = ["cache", "controller", "cron_job", "db", "domain", "handler", "repository", "route", "service"];
const validFrontendPackages = ["api", "component", "hook", "page", "state", "style"];
const validSharedPackages = ["auth", "config", "middleware", "utils"];

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

// This token needs to be set after registration + auth
let authToken = process.env.LOG_AUTH_TOKEN || "";

const setAuthToken = (token) => {
  authToken = token;
};

/**
 * Sends a log entry to the evaluation server.
 * @param {string} stack - "backend" or "frontend"
 * @param {string} level - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - package name (see valid values per stack)
 * @param {string} message - descriptive log message
 */
const Log = async (stack, level, pkg, message) => {
  // basic validation before sending
  if (!validStacks.includes(stack)) {
    console.warn(`[Logger] Invalid stack: ${stack}`);
    return;
  }
  if (!validLevels.includes(level)) {
    console.warn(`[Logger] Invalid level: ${level}`);
    return;
  }

  const allValid = [...validBackendPackages, ...validFrontendPackages, ...validSharedPackages];
  if (!allValid.includes(pkg)) {
    console.warn(`[Logger] Invalid package: ${pkg}`);
    return;
  }

  try {
    const res = await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // only log success in dev mode to avoid noise
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Logger] ${level.toUpperCase()} logged — ID: ${res.data?.logID}`);
    }
  } catch (err) {
    // don't crash the app if logging fails
    console.error(`[Logger] Failed to send log: ${err.message}`);
  }
};

module.exports = { Log, setAuthToken };
