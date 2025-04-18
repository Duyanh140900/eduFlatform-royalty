const PointConfig = require("../models/pointConfig");
const Badge = require("../models/badge");
const PointTransaction = require("../models/pointTransaction");
const UserPoint = require("../models/userPoint");

const adminController = {
  /**
   * Lấy danh sách cấu hình điểm
   */
  async getPointConfigs(req, res) {
    try {
      const configs = await PointConfig.find().sort({ scenarioType: 1 });

      return res.status(200).json({
        success: true,
        data: configs,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách cấu hình điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách cấu hình điểm",
      });
    }
  },

  /**
   * Lấy thông tin cấu hình điểm
   */
  async getPointConfig(req, res) {
    try {
      const { id } = req.params;

      const config = await PointConfig.findById(id);

      if (!config) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cấu hình điểm",
        });
      }

      return res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin cấu hình điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin cấu hình điểm",
      });
    }
  },

  /**
   * Tạo cấu hình điểm mới
   */
  async createPointConfig(req, res) {
    try {
      const {
        scenarioType,
        name,
        description,
        pointValue,
        isActive,
        redemptionRate,
      } = req.body;

      // Kiểm tra cấu hình đã tồn tại
      const existingConfig = await PointConfig.findOne({ scenarioType });
      if (existingConfig) {
        return res.status(400).json({
          success: false,
          message: "Cấu hình điểm với scenarioType này đã tồn tại",
        });
      }

      const newConfig = new PointConfig({
        scenarioType,
        name,
        description,
        pointValue,
        isActive: isActive !== undefined ? isActive : true,
        redemptionRate: redemptionRate || 1000, // Mặc định 1 điểm = 1000 VND
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newConfig.save();

      return res.status(201).json({
        success: true,
        data: newConfig,
        message: "Tạo cấu hình điểm thành công",
      });
    } catch (error) {
      console.error("Lỗi tạo cấu hình điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo cấu hình điểm",
      });
    }
  },

  /**
   * Cập nhật cấu hình điểm
   */
  async updatePointConfig(req, res) {
    try {
      const { id } = req.params;
      const { name, description, pointValue, isActive, redemptionRate } =
        req.body;

      const config = await PointConfig.findById(id);

      if (!config) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cấu hình điểm",
        });
      }

      // Cập nhật thông tin
      if (name) config.name = name;
      if (description !== undefined) config.description = description;
      if (pointValue !== undefined) config.pointValue = pointValue;
      if (isActive !== undefined) config.isActive = isActive;
      if (redemptionRate !== undefined) config.redemptionRate = redemptionRate;

      config.updatedAt = new Date();

      await config.save();

      return res.status(200).json({
        success: true,
        data: config,
        message: "Cập nhật cấu hình điểm thành công",
      });
    } catch (error) {
      console.error("Lỗi cập nhật cấu hình điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật cấu hình điểm",
      });
    }
  },

  /**
   * Xóa cấu hình điểm
   */
  async deletePointConfig(req, res) {
    try {
      const { id } = req.params;

      const config = await PointConfig.findById(id);

      if (!config) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cấu hình điểm",
        });
      }

      await config.remove();

      return res.status(200).json({
        success: true,
        message: "Xóa cấu hình điểm thành công",
      });
    } catch (error) {
      console.error("Lỗi xóa cấu hình điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa cấu hình điểm",
      });
    }
  },

  /**
   * Lấy danh sách huy hiệu
   */
  async getBadges(req, res) {
    try {
      const badges = await Badge.find().sort({ minPoints: 1 });

      return res.status(200).json({
        success: true,
        data: badges,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách huy hiệu:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách huy hiệu",
      });
    }
  },

  /**
   * Tạo huy hiệu mới
   */
  async createBadge(req, res) {
    try {
      const { name, minPoints, icon, benefits, isActive } = req.body;

      // Kiểm tra huy hiệu đã tồn tại
      const existingBadge = await Badge.findOne({ name });
      if (existingBadge) {
        return res.status(400).json({
          success: false,
          message: "Huy hiệu với tên này đã tồn tại",
        });
      }

      const newBadge = new Badge({
        name,
        minPoints,
        icon,
        benefits: benefits || [],
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await newBadge.save();

      return res.status(201).json({
        success: true,
        data: newBadge,
        message: "Tạo huy hiệu thành công",
      });
    } catch (error) {
      console.error("Lỗi tạo huy hiệu:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo huy hiệu",
      });
    }
  },

  /**
   * Cập nhật huy hiệu
   */
  async updateBadge(req, res) {
    try {
      const { id } = req.params;
      const { name, minPoints, icon, benefits, isActive } = req.body;

      const badge = await Badge.findById(id);

      if (!badge) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy huy hiệu",
        });
      }

      // Cập nhật thông tin
      if (name) badge.name = name;
      if (minPoints !== undefined) badge.minPoints = minPoints;
      if (icon) badge.icon = icon;
      if (benefits) badge.benefits = benefits;
      if (isActive !== undefined) badge.isActive = isActive;

      badge.updatedAt = new Date();

      await badge.save();

      return res.status(200).json({
        success: true,
        data: badge,
        message: "Cập nhật huy hiệu thành công",
      });
    } catch (error) {
      console.error("Lỗi cập nhật huy hiệu:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật huy hiệu",
      });
    }
  },

  /**
   * Thống kê tích điểm
   */
  async getPointStatistics(req, res) {
    try {
      const { startDate, endDate } = req.query;

      let matchQuery = {};

      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) {
          matchQuery.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          matchQuery.createdAt.$lte = new Date(endDate);
        }
      }

      // Tổng số điểm tích lũy
      const totalEarnedPoints = await PointTransaction.aggregate([
        {
          $match: {
            ...matchQuery,
            type: "EARN",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$points" },
          },
        },
      ]);

      // Tổng số điểm đã sử dụng
      const totalRedeemedPoints = await PointTransaction.aggregate([
        {
          $match: {
            ...matchQuery,
            type: "REDEEM",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$points" },
          },
        },
      ]);

      // Tổng số điểm còn lại trong hệ thống
      const totalRemainingPoints = await UserPoint.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPoints" },
          },
        },
      ]);

      // Thống kê theo kịch bản tích điểm
      const pointsByScenario = await PointTransaction.aggregate([
        {
          $match: {
            ...matchQuery,
            type: "EARN",
          },
        },
        {
          $group: {
            _id: "$scenarioType",
            total: { $sum: "$points" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { total: -1 },
        },
      ]);

      // Số lượng người dùng có điểm
      const userCount = await UserPoint.countDocuments({
        totalPoints: { $gt: 0 },
      });

      return res.status(200).json({
        success: true,
        data: {
          totalEarnedPoints:
            totalEarnedPoints.length > 0 ? totalEarnedPoints[0].total : 0,
          totalRedeemedPoints:
            totalRedeemedPoints.length > 0 ? totalRedeemedPoints[0].total : 0,
          totalRemainingPoints:
            totalRemainingPoints.length > 0 ? totalRemainingPoints[0].total : 0,
          pointsByScenario,
          userCount,
        },
      });
    } catch (error) {
      console.error("Lỗi thống kê tích điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi thống kê tích điểm",
      });
    }
  },
};

module.exports = adminController;
