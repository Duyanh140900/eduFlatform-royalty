const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const connectDB = require("./config/db");
const pointRoutes = require("./routes/pointRoutes");
const rankingRoutes = require("./routes/rankingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const settingRoutes = require("./routes/settingRoutes");
const { attachToken } = require("./middleware/auth");

// Tải biến môi trường
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(attachToken);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/points", pointRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/admin", adminRoutes);

// Route mặc định
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Hệ thống Quản lý Điểm Thưởng đang hoạt động",
  });
});

// Swagger JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Lỗi máy chủ nội bộ",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API không tồn tại",
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
