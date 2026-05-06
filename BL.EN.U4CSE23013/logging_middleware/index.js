const axios = require("axios");

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validPackages = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
  "api", "component", "hook", "page", "state", "style",
  "auth", "config", "middleware", "utils",
];

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

// Default token — can be overridden via env or setAuthToken()
let authToken =
  process.env.LOG_AUTH_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJibC5lbi51NGNzZTIzMDEzQGJsLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjIzOTksImlhdCI6MTc3ODA2MTQ5OSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjBmNGVlZjY5LTg4MzItNDdhNC1iZDExLTI5YWVlODQzNjI3ZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhlbWFudGggYWxsYSIsInN1YiI6ImFlYmMzMmIwLTc1OGQtNDgxMC05YjJlLTY5MzJmZjY4ZjQ3YiJ9LCJlbWFpbCI6ImJsLmVuLnU0Y3NlMjMwMTNAYmwuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJoZW1hbnRoIGFsbGEiLCJyb2xsTm8iOiJibC5lbi51NGNzZTIzMDEzIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiYWViYzMyYjAtNzU4ZC00ODEwLTliMmUtNjkzMmZmNjhmNDdiIiwiY2xpZW50U2VjcmV0IjoicW1Ed1hXTXd2Tld1TllIWiJ9.l4UAmdSNUXNcFxcfaeHjC5T3qQkq5pdrJsVDvcb3cdc";

const setAuthToken = (token) => {
  authToken = token;
};

/**
 * Sends a log entry to the evaluation server.
 * @param {string} stack  - "backend" | "frontend"
 * @param {string} level  - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg    - package name (see valid values)
 * @param {string} message - descriptive log message
 */
const Log = async (stack, level, pkg, message) => {
  if (!validStacks.includes(stack)) {
    console.warn(`[Logger] Invalid stack: ${stack}`);
    return;
  }
  if (!validLevels.includes(level)) {
    console.warn(`[Logger] Invalid level: ${level}`);
    return;
  }
  if (!validPackages.includes(pkg)) {
    console.warn(`[Logger] Invalid package: ${pkg}`);
    return;
  }

  try {
    const res = await axios.post(
      LOG_API_URL,
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[Logger] ${level.toUpperCase()} | ${pkg} | ID: ${res.data?.logID}`);
  } catch (err) {
    console.error(`[Logger] Failed: ${err.message}`);
  }
};

module.exports = { Log, setAuthToken };
