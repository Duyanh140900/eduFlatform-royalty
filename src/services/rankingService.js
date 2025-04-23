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
          name: userInfo.success
            ? userInfo.data.fullName
            : `User ${point._id.substring(0, 5)}...`,
          totalPoints: point.totalPoints,
          badgeLevel: badgeLevel || null,
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

      // Tìm huy hiệu phù hợp theo điểm và thứ hạng
      let userBadge = null;
      let nextBadge = null;

      for (let i = 0; i < badges.length; i++) {
        const badge = badges[i];

        // Kiểm tra điều kiện huy hiệu (điểm tối thiểu và xếp hạng)
        if (
          totalPoints >= badge.minPoints &&
          (!badge.topPoints || rank <= badge.topPoints)
        ) {
          userBadge = badge;
          nextBadge = badges[i - 1] || null;
          break;
        }
      }

      // Nếu không tìm thấy huy hiệu nào phù hợp, lấy huy hiệu có điểm thấp nhất
      if (!userBadge) {
        userBadge = badges[badges.length - 1];
        nextBadge = badges[badges.length - 2] || null;
      }

      return userBadge.name;
    } catch (error) {
      console.error("Lỗi kiểm tra huy hiệu:", error);
      return null;
    }
  },
};

module.exports = rankingService;
