const express = require("express");
const cors = require("cors");

const equipmentRoutes = require("./routes/equipmentRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const issueRoutes = require("./routes/issueRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Lab Equipment Management API is running",
  });
});

// API ROUTES
app.use("/api/equipment", equipmentRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/issue-return", issueRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// HANDLE UNKNOWN ROUTES
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ERROR HANDLING
app.use(errorMiddleware);

module.exports = app;
