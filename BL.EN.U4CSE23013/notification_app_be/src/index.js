const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const loggerMiddleware = require("./middleware/loggerMiddleware");
const notificationRoutes = require("./routes/routes");
const Log = require("./services/logger");

const app = express();

app.use(cors());
app.use(express.json());

// log every incoming request
app.use(loggerMiddleware);

// health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Notification API is running" });
});

// ── Proxy route: forwards /eval/* to the evaluation server ──────────────────
// This avoids CORS issues when the browser calls the external server directly.
const EVAL_BASE = "http://20.207.122.201/evaluation-service";
const getToken = () => process.env.LOG_AUTH_TOKEN;

app.use("/eval", async (req, res) => {
  try {
    const url = `${EVAL_BASE}${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      params: req.query,
      data: req.body,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    res.status(status).json(data);
  }
});

// main routes
app.use("/api", notificationRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await Log("backend", "info", "config", `Server started on port ${PORT}`);
});
