const rankingService = require("../services/rankingService");

const rankingController = {
  /**
   * Lấy bảng xếp hạng người dùng
   */
  async getRankings(req, res) {
    try {
      const { timeRange = "month", limit = 10 } = req.query;

      // Kiểm tra timeRange hợp lệ
      const validTimeRanges = ["day", "week", "month"];
      if (!validTimeRanges.includes(timeRange)) {
        return res.status(400).json({
          success: false,
          message: "Thời gian không hợp lệ. Vui lòng chọn day, week hoặc month",
        });
      }

      const rankings = await rankingService.getRankings(timeRange, limit);

      return res.status(200).json(rankings);
    } catch (error) {
      console.error("Lỗi lấy bảng xếp hạng:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy bảng xếp hạng",
      });
    }
  },

  /**
   * Lấy thứ hạng của một người dùng cụ thể
   */
  async getUserRanking(req, res) {
    try {
      const { userId } = req.params;
      const { timeRange = "month" } = req.query;

      // Kiểm tra timeRange hợp lệ
      const validTimeRanges = ["day", "week", "month"];
      if (!validTimeRanges.includes(timeRange)) {
        return res.status(400).json({
          success: false,
          message: "Thời gian không hợp lệ. Vui lòng chọn day, week hoặc month",
        });
      }

      const ranking = await rankingService.getUserRanking(userId, timeRange);

      return res.status(200).json(ranking);
    } catch (error) {
      console.error("Lỗi lấy xếp hạng người dùng:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy xếp hạng người dùng",
      });
    }
  },

  /**
   * Cập nhật xếp hạng thủ công (chỉ dành cho admin)
   */
  async updateRankings(req, res) {
    try {
      const result = await rankingService.updateRankings();

      return res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi cập nhật xếp hạng:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật xếp hạng",
      });
    }
  },
};

module.exports = rankingController;
