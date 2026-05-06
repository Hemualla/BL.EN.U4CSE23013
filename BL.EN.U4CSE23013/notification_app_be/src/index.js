const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const loggerMiddleware = require("./middleware/loggerMiddleware");
const notificationRoutes = require("./routes/routes");
const Log = require("./services/logger");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(loggerMiddleware);

// ── Token auto-refresh ────────────────────────────────────────────────────────
// The evaluation server token expires every ~15 minutes.
// We refresh it every 14 minutes so the proxy never fails.
const EVAL_BASE = "http://20.207.122.201/evaluation-service";

let currentToken = process.env.LOG_AUTH_TOKEN;

const refreshToken = async () => {
  try {
    const res = await axios.post(`${EVAL_BASE}/auth`, {
      email: process.env.EMAIL,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      name: process.env.NAME,
    });
    currentToken = res.data.access_token;
    console.log("[Token] Refreshed successfully");
  } catch (err) {
    console.error("[Token] Refresh failed:", err.message);
  }
};

// Refresh every 14 minutes (token expires in ~15 min)
setInterval(refreshToken, 14 * 60 * 1000);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Notification API is running" });
});

// ── Proxy: /eval/* → evaluation server ───────────────────────────────────────
// Frontend calls this instead of the external server directly (avoids CORS).
app.use("/eval", async (req, res) => {
  try {
    const url = `${EVAL_BASE}${req.path}`;
    const response = await axios({
      method: req.method,
      url,
      params: req.query,
      data: req.body,
      headers: {
        Authorization: `Bearer ${currentToken}`,
        "Content-Type": "application/json",
      },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    // If token expired mid-request, refresh and retry once
    if (err.response?.status === 401) {
      console.log("[Token] 401 received — refreshing and retrying...");
      await refreshToken();
      try {
        const url = `${EVAL_BASE}${req.path}`;
        const retry = await axios({
          method: req.method,
          url,
          params: req.query,
          data: req.body,
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "application/json",
          },
        });
        return res.status(retry.status).json(retry.data);
      } catch (retryErr) {
        return res.status(retryErr.response?.status || 500).json(
          retryErr.response?.data || { message: retryErr.message }
        );
      }
    }
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    res.status(status).json(data);
  }
});

// ── Main API routes ───────────────────────────────────────────────────────────
app.use("/api", notificationRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await Log("backend", "info", "config", `Server started on port ${PORT}`);
});
