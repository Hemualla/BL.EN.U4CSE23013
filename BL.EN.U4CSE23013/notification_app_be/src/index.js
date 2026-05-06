const express = require("express");
const cors = require("cors");
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
