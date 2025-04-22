const userService = require("../services/userService");

const userController = {
  /**
   * Lấy thông tin người dùng
   */
  async getMyInfo(req, res) {
    try {
      // Lấy token từ req
      const token = req.token;
      const result = await userService.getMyInfo(token);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin người dùng",
      });
    }
  },
  /**
   * Lấy thông tin người dùng
   */
  async getUserInfo(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu userId",
        });
      }

      const result = await userService.getUserInfo(userId);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin người dùng",
      });
    }
  },

  /**
   * Cập nhật thông tin người dùng vào cache
   */
  async updateUserCache(req, res) {
    try {
      const userData = req.body;

      if (!userData || !userData.userId) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin bắt buộc",
        });
      }

      const result = await userService.updateUserCache(userData);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Lỗi cập nhật cache người dùng:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật thông tin người dùng",
      });
    }
  },

  /**
   * Cập nhật đồng loạt thông tin nhiều người dùng
   */
  async bulkUpdateUserCache(req, res) {
    try {
      const { users } = req.body;

      if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
        });
      }

      const result = await userService.bulkUpdateUserCache(users);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Lỗi cập nhật hàng loạt:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật thông tin hàng loạt",
      });
    }
  },
};

module.exports = userController;
