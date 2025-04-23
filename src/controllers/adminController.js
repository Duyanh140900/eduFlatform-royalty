const PointConfig = require("../models/pointConfig");
const Badge = require("../models/badge");
const PointTransaction = require("../models/pointTransaction");
const UserPoint = require("../models/userPoint");
const Setting = require("../models/setting");

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
      const { scenarioType, name, description, pointValue, isActive } =
        req.body;

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
      const { name, description, pointValue, isActive } = req.body;

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
      const { name, minPoints, topPoints, icon, benefits, isActive } = req.body;

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
        topPoints,
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
      const { name, minPoints, topPoints, icon, benefits, isActive } = req.body;

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
      if (topPoints !== undefined) badge.topPoints = topPoints;
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

  /**
   * Lấy danh sách tất cả cài đặt
   */
  async getSettings(req, res) {
    try {
      const settings = await Setting.find().sort({ category: 1, key: 1 });

      return res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách cài đặt:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách cài đặt",
      });
    }
  },

  /**
   * Lấy thông tin chi tiết cài đặt
   */
  async getSetting(req, res) {
    try {
      const { key } = req.params;

      const setting = await Setting.findOne({ key });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cài đặt",
        });
      }

      return res.status(200).json({
        success: true,
        data: setting,
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin cài đặt:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin cài đặt",
      });
    }
  },

  /**
   * Tạo cài đặt mới
   */
  async createSetting(req, res) {
    try {
      const { key, name, value, dataType, description, category, isPublic } =
        req.body;

      // Kiểm tra cài đặt đã tồn tại
      const existingSetting = await Setting.findOne({ key });
      if (existingSetting) {
        return res.status(400).json({
          success: false,
          message: "Cài đặt với key này đã tồn tại",
        });
      }

      // Chuyển đổi giá trị theo kiểu dữ liệu
      let convertedValue = value;
      if (dataType === "number") {
        convertedValue = Number(value);
      } else if (dataType === "boolean") {
        convertedValue = value === "true" || value === true;
      } else if (dataType === "json" && typeof value === "string") {
        try {
          convertedValue = JSON.parse(value);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Giá trị JSON không hợp lệ",
          });
        }
      }

      const newSetting = new Setting({
        key,
        name,
        value: convertedValue,
        dataType: dataType || "string",
        description,
        category: category || "general",
        isPublic: isPublic !== undefined ? isPublic : false,
      });

      await newSetting.save();

      return res.status(201).json({
        success: true,
        data: newSetting,
        message: "Tạo cài đặt thành công",
      });
    } catch (error) {
      console.error("Lỗi tạo cài đặt:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo cài đặt",
      });
    }
  },

  /**
   * Cập nhật cài đặt
   */
  async updateSetting(req, res) {
    try {
      const { key } = req.params;
      const { name, value, dataType, description, category, isPublic } =
        req.body;

      const setting = await Setting.findOne({ key });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cài đặt",
        });
      }

      // Cập nhật thông tin
      if (name) setting.name = name;

      // Cập nhật giá trị và chuyển đổi theo kiểu dữ liệu
      if (value !== undefined) {
        const effectiveDataType = dataType || setting.dataType;

        let convertedValue = value;
        if (effectiveDataType === "number") {
          convertedValue = Number(value);
        } else if (effectiveDataType === "boolean") {
          convertedValue = value === "true" || value === true;
        } else if (effectiveDataType === "json" && typeof value === "string") {
          try {
            convertedValue = JSON.parse(value);
          } catch (error) {
            return res.status(400).json({
              success: false,
              message: "Giá trị JSON không hợp lệ",
            });
          }
        }

        setting.value = convertedValue;
      }

      if (dataType) setting.dataType = dataType;
      if (description !== undefined) setting.description = description;
      if (category) setting.category = category;
      if (isPublic !== undefined) setting.isPublic = isPublic;

      await setting.save();

      return res.status(200).json({
        success: true,
        data: setting,
        message: "Cập nhật cài đặt thành công",
      });
    } catch (error) {
      console.error("Lỗi cập nhật cài đặt:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật cài đặt",
      });
    }
  },

  /**
   * Xóa cài đặt
   */
  async deleteSetting(req, res) {
    try {
      const { key } = req.params;

      const setting = await Setting.findOne({ key });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cài đặt",
        });
      }

      await setting.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Xóa cài đặt thành công",
      });
    } catch (error) {
      console.error("Lỗi xóa cài đặt:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi xóa cài đặt",
      });
    }
  },

  /**
   * Khởi tạo các cài đặt mặc định nếu chưa tồn tại
   */
  async initializeSettings(req, res) {
    try {
      await Setting.initializeDefaults();

      return res.status(200).json({
        success: true,
        message: "Khởi tạo cài đặt mặc định thành công",
      });
    } catch (error) {
      console.error("Lỗi khởi tạo cài đặt mặc định:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi khởi tạo cài đặt mặc định",
      });
    }
  },
};

module.exports = adminController;
