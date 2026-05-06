const axios = require("axios");

const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJibC5lbi51NGNzZTIzMDEzQGJsLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjIzOTksImlhdCI6MTc3ODA2MTQ5OSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjBmNGVlZjY5LTg4MzItNDdhNC1iZDExLTI5YWVlODQzNjI3ZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhlbWFudGggYWxsYSIsInN1YiI6ImFlYmMzMmIwLTc1OGQtNDgxMC05YjJlLTY5MzJmZjY4ZjQ3YiJ9LCJlbWFpbCI6ImJsLmVuLnU0Y3NlMjMwMTNAYmwuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJoZW1hbnRoIGFsbGEiLCJyb2xsTm8iOiJibC5lbi51NGNzZTIzMDEzIiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiYWViYzMyYjAtNzU4ZC00ODEwLTliMmUtNjkzMmZmNjhmNDdiIiwiY2xpZW50U2VjcmV0IjoicW1Ed1hXTXd2Tld1TllIWiJ9.l4UAmdSNUXNcFxcfaeHjC5T3qQkq5pdrJsVDvcb3cdc";

const getToken = () => process.env.LOG_AUTH_TOKEN || DEFAULT_TOKEN;

/**
 * Sends a structured log to the evaluation server.
 * @param {string} stack  - "backend" | "frontend"
 * @param {string} level  - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg    - package name e.g. "controller", "middleware", "service"
 * @param {string} message - what happened
 */
const Log = async (stack, level, pkg, message) => {
  try {
    const response = await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[Logger] ${level.toUpperCase()} | ${pkg} | ID: ${response.data?.logID}`);
  } catch (err) {
    console.error(`[Logger] Could not send log: ${err.message}`);
  }
};

module.exports = Log;
