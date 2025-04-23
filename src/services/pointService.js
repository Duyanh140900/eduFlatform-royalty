const UserPoint = require("../models/userPoint");
const PointTransaction = require("../models/pointTransaction");
const PointConfig = require("../models/pointConfig");
const Badge = require("../models/badge");

const pointService = {
  /**
   * Thêm điểm cho người dùng
   */
  async earnPoints(userId, scenarioType, metadata = {}) {
    try {
      // Lấy cấu hình điểm
      const config = await PointConfig.findOne({
        scenarioType,
        isActive: true,
      });
      if (!config) {
        throw new Error(
          "Cấu hình tích điểm không tồn tại hoặc không được kích hoạt"
        );
      }

      // Lấy hoặc tạo thông tin điểm người dùng
      let userPoint = await UserPoint.findOne({ userId });
      if (!userPoint) {
        userPoint = new UserPoint({ userId });
      }

      // Cập nhật điểm
      userPoint.totalPoints += config.pointValue;
      userPoint.updatedAt = new Date();

      // Cập nhật huy hiệu
      const newBadge = await Badge.findOne({
        minPoints: { $lte: userPoint.totalPoints },
        isActive: true,
      })
        .sort({ minPoints: -1 })
        .limit(1);

      if (newBadge) {
        userPoint.badgeLevel = newBadge.name;
      }

      await userPoint.save();

      // Lưu lịch sử giao dịch
      const transaction = new PointTransaction({
        userId,
        type: "EARN",
        points: config.pointValue,
        scenarioType,
        description: config.description,
        courseId: metadata.courseId,
        orderId: metadata.orderId,
        createdAt: new Date(),
      });

      await transaction.save();

      // Cập nhật xếp hạng (được triển khai trong rankingService)

      return {
        success: true,
        points: config.pointValue,
        totalPoints: userPoint.totalPoints,
      };
    } catch (error) {
      console.error("Lỗi tích điểm:", error);
      throw error;
    }
  },

  /**
   * Sử dụng điểm để đổi lấy ưu đãi
   */
  async redeemPoints(userId, points, orderId) {
    try {
      // Kiểm tra điểm của người dùng
      const userPoint = await UserPoint.findOne({ userId });
      if (!userPoint) {
        throw new Error("Người dùng không tồn tại");
      }

      if (userPoint.totalPoints < points) {
        throw new Error("Số điểm không đủ");
      }

      // Lấy tỷ lệ quy đổi điểm
      const config = await PointConfig.findOne({
        scenarioType: "redemption_rate",
        isActive: true,
      });

      // Cập nhật điểm
      userPoint.totalPoints -= points;
      userPoint.updatedAt = new Date();
      await userPoint.save();

      // Lưu lịch sử giao dịch
      const transaction = new PointTransaction({
        userId,
        type: "REDEEM",
        points: -points,
        scenarioType: "order_discount",
        description: "Sử dụng điểm để giảm giá đơn hàng",
        orderId,
        createdAt: new Date(),
      });

      await transaction.save();

      return {
        success: true,
        pointsRedeemed: points,
        remainingPoints: userPoint.totalPoints,
      };
    } catch (error) {
      console.error("Lỗi tiêu điểm:", error);
      throw error;
    }
  },

  /**
   * Lấy số dư điểm của người dùng
   */
  async getBalance(userId) {
    try {
      const userPoint = await UserPoint.findOne({ userId });

      if (!userPoint) {
        return {
          success: true,
          totalPoints: 0,
          badgeLevel: "Mới",
          rank: null,
        };
      }

      return {
        success: true,
        totalPoints: userPoint.totalPoints,
        badgeLevel: userPoint.badgeLevel,
        rank: userPoint.rank,
      };
    } catch (error) {
      console.error("Lỗi lấy số dư điểm:", error);
      throw error;
    }
  },

  /**
   * Lấy lịch sử giao dịch điểm
   */
  async getHistory(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const transactions = await PointTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await PointTransaction.countDocuments({ userId });

      return {
        success: true,
        data: transactions,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch điểm:", error);
      throw error;
    }
  },
};

module.exports = pointService;
