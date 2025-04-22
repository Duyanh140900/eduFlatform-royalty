const axios = require("axios");
const UserInfo = require("../models/userInfo");
const jwt = require("jsonwebtoken");

const userService = {
  /**
   * Lấy thông tin người dùng
   */
  async getMyInfo(token) {
    try {
      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin người dùng từ database
      // const userInfo = await UserInfo.findOne({ userId: decoded.userId });

      // if (!userInfo) {
      //   return {
      //     success: false,
      //     message: "Người dùng không tồn tại",
      //   };
      // }

      return {
        success: true,
        data: decoded,
      };
    } catch (error) {
      console.error(
        "Lỗi khi giải mã token hoặc lấy thông tin người dùng:",
        error
      );

      return {
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      };
    }
  },

  /**
   * Lấy thông tin người dùng từ cache hoặc API bên ngoài
   */
  async getUserInfo(userId, token) {
    try {
      // Tìm trong cache trước
      let userInfo = await UserInfo.findOne({ userId });

      // Nếu tìm thấy và cache chưa hết hạn (1 ngày)
      if (userInfo && Date.now() - userInfo.updatedAt < 24 * 60 * 60 * 1000) {
        return {
          success: true,
          data: userInfo,
        };
      }

      // Nếu không có trong cache hoặc cache đã hết hạn, gọi API
      const apiUrl =
        process.env.USER_API_URL || "https://api.pm-ptdv.com/api/user/info";
      const response = await axios.get(`${apiUrl}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sử dụng token từ middleware
        },
      });

      if (response.data && response.data.success) {
        // Cập nhật hoặc tạo mới cache
        userInfo = await UserInfo.findOneAndUpdate(
          { userId },
          {
            fullName: response.data.data.fullname || "",
            email: response.data.data.email,
            avatar: response.data.data.avatar,
            updatedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        return {
          success: true,
          data: userInfo,
        };
      }

      // Nếu có thông tin trong cache thì vẫn trả về dù đã hết hạn
      if (userInfo) {
        return {
          success: true,
          data: userInfo,
          cached: true,
        };
      }

      return {
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);

      // Nếu có lỗi nhưng có thông tin trong cache, vẫn trả về
      const userInfo = await UserInfo.findOne({ userId });
      if (userInfo) {
        return {
          success: true,
          data: userInfo,
          cached: true,
        };
      }

      return {
        success: false,
        message: "Lỗi khi lấy thông tin người dùng",
      };
    }
  },

  /**
   * Cập nhật thông tin người dùng vào cache
   */
  async updateUserCache(userData) {
    try {
      if (!userData || !userData.userId) {
        return {
          success: false,
          message: "Dữ liệu không hợp lệ",
        };
      }

      const userInfo = await UserInfo.findOneAndUpdate(
        { userId: userData.userId },
        {
          fullName: userData.fullName || "",
          email: userData.email,
          avatar: userData.avatar,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      return {
        success: true,
        data: userInfo,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật cache người dùng:", error);
      return {
        success: false,
        message: "Lỗi khi cập nhật thông tin người dùng",
      };
    }
  },

  /**
   * Cập nhật đồng loạt thông tin nhiều người dùng
   */
  async bulkUpdateUserCache(usersData) {
    try {
      if (!Array.isArray(usersData) || usersData.length === 0) {
        return {
          success: false,
          message: "Dữ liệu không hợp lệ",
        };
      }

      const operations = usersData.map((user) => ({
        updateOne: {
          filter: { userId: user.userId },
          update: {
            fullName: user.fullName || "",
            email: user.email,
            avatar: user.avatar,
            updatedAt: new Date(),
          },
          upsert: true,
        },
      }));

      await UserInfo.bulkWrite(operations);

      return {
        success: true,
        message: `Đã cập nhật ${usersData.length} người dùng`,
      };
    } catch (error) {
      console.error("Lỗi khi cập nhật hàng loạt:", error);
      return {
        success: false,
        message: "Lỗi khi cập nhật thông tin hàng loạt",
      };
    }
  },
};

module.exports = userService;
