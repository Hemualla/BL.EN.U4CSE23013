const Log = require("../services/logger");

/**
 * Express middleware that logs every incoming request to the evaluation server.
 * Runs before route handlers so every endpoint gets tracked.
 */
const loggerMiddleware = async (req, res, next) => {
  const msg = `${req.method} ${req.originalUrl} — request received`;

  await Log("backend", "info", "middleware", msg);

  next();
};

module.exports = loggerMiddleware;
