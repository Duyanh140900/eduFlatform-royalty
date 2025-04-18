const UserPoint = require("../models/userPoint");
const PointTransaction = require("../models/pointTransaction");
const userService = require("./userService");

const rankingService = {
  /**
   * Cập nhật xếp hạng cho tất cả người dùng
   */
  async updateRankings() {
    try {
      const users = await UserPoint.find().sort({ totalPoints: -1 });

      for (let i = 0; i < users.length; i++) {
        users[i].rank = i + 1;
        await users[i].save();
      }

      return { success: true, message: "Đã cập nhật xếp hạng" };
    } catch (error) {
      console.error("Lỗi cập nhật xếp hạng:", error);
      throw error;
    }
  },

  /**
   * Lấy bảng xếp hạng theo thời gian
   */
  async getRankings(timeRange = "month", limit = 10) {
    try {
      let startDate = new Date();
      const endDate = new Date();

      // Xác định thời gian bắt đầu dựa vào timeRange
      if (timeRange === "day") {
        // Ngày hôm qua (T-1)
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === "week") {
        // Tuần hiện tại cộng dồn đến ngày T-1
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day + (day === 0 ? -6 : 1)); // Lấy thứ 2 đầu tuần
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === "month") {
        // Tháng hiện tại cộng dồn đến ngày T-1
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
      }

      // Tính tổng điểm của mỗi người dùng trong khoảng thời gian
      const userPoints = await PointTransaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            type: "EARN",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: "$points" },
          },
        },
        {
          $sort: { totalPoints: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);

      // Lấy thông tin chi tiết của người dùng
      const rankings = [];
      for (const [index, point] of userPoints.entries()) {
        const userPoint = await UserPoint.findOne({ userId: point._id });

        // Lấy thông tin user từ cache
        const userInfo = await userService.getUserInfo(point._id);

        rankings.push({
          rank: index + 1,
          userId: point._id,
          name: userInfo.success
            ? userInfo.data.fullName
            : `User ${point._id.substring(0, 5)}...`,
          totalPoints: point.totalPoints,
          badgeLevel: userPoint ? userPoint.badgeLevel : "Mới",
          avatar: userInfo.success ? userInfo.data.avatar : null,
        });
      }

      return {
        success: true,
        timeRange,
        data: rankings,
      };
    } catch (error) {
      console.error("Lỗi lấy bảng xếp hạng:", error);
      throw error;
    }
  },

  /**
   * Lấy xếp hạng của một người dùng cụ thể
   */
  async getUserRanking(userId, timeRange = "month") {
    try {
      // Lấy thông tin điểm của người dùng
      const userPoint = await UserPoint.findOne({ userId });
      if (!userPoint) {
        return {
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        };
      }

      // Lấy xếp hạng hiện tại trên toàn cầu
      const globalRank =
        userPoint.rank || (await this.calculateGlobalRank(userId));

      // Lấy xếp hạng trong khoảng thời gian
      let startDate = new Date();
      const endDate = new Date();

      // Xác định thời gian bắt đầu dựa vào timeRange
      if (timeRange === "day") {
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === "week") {
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day + (day === 0 ? -6 : 1));
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === "month") {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
      }

      // Tính điểm trong khoảng thời gian
      const periodPoints = await PointTransaction.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: startDate, $lte: endDate },
            type: "EARN",
          },
        },
        {
          $group: {
            _id: null,
            totalPoints: { $sum: "$points" },
          },
        },
      ]);

      const userPeriodPoints =
        periodPoints.length > 0 ? periodPoints[0].totalPoints : 0;

      // Tính xếp hạng trong khoảng thời gian
      const usersAbove = await PointTransaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            type: "EARN",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPoints: { $sum: "$points" },
          },
        },
        {
          $match: {
            totalPoints: { $gt: userPeriodPoints },
          },
        },
        {
          $count: "count",
        },
      ]);

      const periodRank = usersAbove.length > 0 ? usersAbove[0].count + 1 : 1;

      return {
        success: true,
        userId,
        totalPoints: userPoint.totalPoints,
        badgeLevel: userPoint.badgeLevel,
        globalRank,
        timeRange,
        periodPoints: userPeriodPoints,
        periodRank,
      };
    } catch (error) {
      console.error("Lỗi lấy xếp hạng người dùng:", error);
      throw error;
    }
  },

  /**
   * Tính toán xếp hạng toàn cầu của một người dùng
   */
  async calculateGlobalRank(userId) {
    try {
      const userPoint = await UserPoint.findOne({ userId });
      if (!userPoint) {
        return null;
      }

      const usersAbove = await UserPoint.countDocuments({
        totalPoints: { $gt: userPoint.totalPoints },
      });

      return usersAbove + 1;
    } catch (error) {
      console.error("Lỗi tính toán xếp hạng toàn cầu:", error);
      throw error;
    }
  },
};

module.exports = rankingService;
