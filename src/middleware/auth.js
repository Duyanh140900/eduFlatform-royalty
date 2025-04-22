const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy token xác thực",
      });
    }

    const token = authHeader.split(" ")[1];
    // Cấu hình JWT Secret từ dự án .NET
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_ISSUER = process.env.JWT_ISSUER;
    const JWT_AUDIENCE = process.env.JWT_AUDIENCE;

    // Xác thực token trực tiếp sử dụng cùng JWT_SECRET với service login
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    // Gán thông tin user vào request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};

const adminAuth = (req, res, next) => {
  try {
    auth(req, res, () => {
      // && req.user.role === "admin"
      if (req.user) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập tài nguyên này",
        });
      }
    });
  } catch (error) {
    console.error("Lỗi xác thực quyền admin:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực quyền admin",
    });
  }
};

function attachToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.token = authHeader.split(" ")[1]; // Gắn token vào req
  }
  next();
}

module.exports = { auth, adminAuth, attachToken };
