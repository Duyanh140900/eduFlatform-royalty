const UserPoint = require("../models/userPoint");
const PointTransaction = require("../models/pointTransaction");
const userService = require("./userService");
const Badge = require("../models/badge");
const {
  getTodayRange,
  getThisMonthRange,
  getThisWeekRange,
  getThisYearRange,
} = require("../utils/helpers");

const rankingService = {
  /**
   * Lấy bảng xếp hạng theo thời gian
   */
  async getRankings(timeRange = "month", limit = 10, token = null) {
    try {
      // Lấy xếp hạng trong khoảng thời gian
      let startDate = new Date();
      let endDate = new Date();

      // Xác định thời gian bắt đầu dựa vào timeRange
      if (timeRange === "day") {
        const { start, end } = getTodayRange();
        startDate = start;
        endDate = end;
      } else if (timeRange === "week") {
        const { start, end } = getThisWeekRange();
        startDate = start;
        endDate = end;
      } else if (timeRange === "month") {
        const { start, end } = getThisMonthRange();
        startDate = start;
        endDate = end;
      } else if (timeRange === "year") {
        const { start, end } = getThisYearRange();
        startDate = start;
        endDate = end;
      }

      // Tính tổng điểm của mỗi người dùng trong khoảng thời gian
      const userPoints = await PointTransaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            type: { $in: ["EARN", "REDEEM"] },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPoints: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "EARN"] },
                  "$points",
                  { $multiply: ["$points", 1] }, // Trừ điểm nếu là REDEEM
                ],
              },
            },
          },
        },
        {
          $sort: { totalPoints: -1 },
        },
        {
          $limit: parseInt(limit),
        },
      ]);
      console.log("userPoints", userPoints, startDate, endDate);
      // Lấy thông tin chi tiết của người dùng
      const rankings = [];
      for (const [index, point] of userPoints.entries()) {
        const badgeLevel = await this.checkUserBadge(
          point.totalPoints,
          index + 1
        );
        // Lấy thông tin user từ cache
        const userInfo = await userService.getUserInfo(point._id, token);

        rankings.push({
          rank: index + 1,
          userId: point._id,
          userName: userInfo.success
            ? userInfo.data.userName
            : `User ${point._id}`,
          fullName: userInfo.success ? userInfo.data.fullName : "",
          totalPoints: point.totalPoints,
          badgeLevel: badgeLevel?.name || null,
          iconBadge: badgeLevel?.icon || null,
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

      // Lấy xếp hạng trong khoảng thời gian
      let startDate = new Date();
      let endDate = new Date();

      // Xác định thời gian bắt đầu dựa vào timeRange
      if (timeRange === "day") {
        const { start, end } = getTodayRange();
        startDate = start;
        endDate = end;
      } else if (timeRange === "week") {
        const { start, end } = getThisWeekRange();
        startDate = start;
        endDate = end;
      } else if (timeRange === "month") {
        const { start, end } = getThisMonthRange();
        startDate = start;
        endDate = end;
      } else if (timeRange === "year") {
        const { start, end } = getThisYearRange();
        startDate = start;
        endDate = end;
      }

      // Tính điểm trong khoảng thời gian
      const periodPoints = await PointTransaction.aggregate([
        {
          $match: {
            userId, // Chỉ lọc theo userId của bạn
            createdAt: { $gte: startDate, $lte: endDate },
            type: { $in: ["EARN", "REDEEM"] },
          },
        },
        {
          $group: {
            _id: "$userId",
            totalPoints: {
              $sum: {
                $cond: [
                  { $eq: ["$type", "EARN"] }, // Cộng điểm nếu là EARN
                  "$points",
                  { $multiply: ["$points", -1] }, // Trừ điểm nếu là REDEEM
                ],
              },
            },
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
   * Kiểm tra huy hiệu người dùng dựa vào điểm tối thiểu và thứ hạng
   * @param {number} totalPoints - Tổng điểm của người dùng
   * @param {number} rank - Thứ hạng của người dùng
   * @returns {Object} - Thông tin về huy hiệu người dùng
   */
  async checkUserBadge(totalPoints, rank) {
    try {
      // Lấy danh sách huy hiệu từ cơ sở dữ liệu
      const badges = await Badge.find({ isActive: true }).sort({
        minPoints: -1,
      });

      if (!badges || badges.length === 0) {
        return null;
      }

      const userBadge = badges.find((badge) => {
        return totalPoints >= badge.minPoints && rank <= badge.topPoints;
      });

      return userBadge;
    } catch (error) {
      console.error("Lỗi kiểm tra huy hiệu:", error);
      return null;
    }
  },
};

module.exports = rankingService;
