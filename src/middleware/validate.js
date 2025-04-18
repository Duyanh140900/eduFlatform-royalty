// Middleware validate cho các request

const validateEarnPoints = (req, res, next) => {
  const { userId, scenarioType } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin userId",
    });
  }

  if (!scenarioType) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin scenarioType",
    });
  }

  next();
};

const validateRedeemPoints = (req, res, next) => {
  const { userId, points, orderId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin userId",
    });
  }

  if (!points || isNaN(points) || points <= 0) {
    return res.status(400).json({
      success: false,
      message: "Số điểm không hợp lệ",
    });
  }

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin orderId",
    });
  }

  next();
};

const validatePointConfig = (req, res, next) => {
  const { scenarioType, name, pointValue } = req.body;

  if (!scenarioType) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin scenarioType",
    });
  }

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Thiếu thông tin name",
    });
  }

  if (!pointValue || isNaN(pointValue) || pointValue < 0) {
    return res.status(400).json({
      success: false,
      message: "Giá trị điểm không hợp lệ",
    });
  }

  next();
};

module.exports = {
  validateEarnPoints,
  validateRedeemPoints,
  validatePointConfig,
};
