const pointService = require("../services/pointService");
const rankingService = require("../services/rankingService");

const pointController = {
  /**
   * Tích điểm cho người dùng
   */
  async earnPoints(req, res) {
    try {
      const { userId, scenarioType, courseId, orderId } = req.body;

      const result = await pointService.earnPoints(userId, scenarioType, {
        courseId,
        orderId,
      });

      // Cập nhật xếp hạng sau khi tích điểm
      await rankingService.updateRankings();

      return res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi tích điểm:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi tích điểm",
      });
    }
  },

  /**
   * Tiêu điểm của người dùng
   */
  async redeemPoints(req, res) {
    try {
      const { userId, points, orderId } = req.body;

      const result = await pointService.redeemPoints(userId, points, orderId);

      // Cập nhật xếp hạng sau khi tiêu điểm
      await rankingService.updateRankings();

      return res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi tiêu điểm:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi tiêu điểm",
      });
    }
  },

  /**
   * Lấy số dư điểm của người dùng
   */
  async getBalance(req, res) {
    try {
      const { userId } = req.params;

      const result = await pointService.getBalance(userId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi lấy số dư điểm:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy số dư điểm",
      });
    }
  },

  /**
   * Lấy lịch sử giao dịch điểm
   */
  async getHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await pointService.getHistory(userId, page, limit);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi lấy lịch sử giao dịch:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy lịch sử giao dịch",
      });
    }
  },
};

module.exports = pointController;
