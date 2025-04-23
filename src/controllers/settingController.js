const Setting = require("../models/setting");

const settingController = {
  /**
   * Lấy danh sách cài đặt công khai
   */
  async getPublicSettings(req, res) {
    try {
      const settings = await Setting.find({ isPublic: true }).sort({
        category: 1,
        key: 1,
      });

      // Chuyển đổi cài đặt thành định dạng thân thiện hơn
      const formattedSettings = settings.reduce((acc, setting) => {
        // Chuyển đổi giá trị theo kiểu dữ liệu (nếu cần)
        let value = setting.value;
        // Nếu giá trị đã được lưu đúng kiểu dữ liệu, không cần chuyển đổi
        if (setting.dataType === "number" && typeof value === "string") {
          value = Number(value);
        } else if (
          setting.dataType === "boolean" &&
          typeof value === "string"
        ) {
          value = value === "true";
        } else if (setting.dataType === "json" && typeof value === "string") {
          try {
            value = JSON.parse(value);
          } catch (error) {
            console.error(`Lỗi parse JSON cho cài đặt ${setting.key}:`, error);
          }
        }

        // Tổ chức cài đặt theo danh mục
        if (!acc[setting.category]) {
          acc[setting.category] = {};
        }

        acc[setting.category][setting.key] = {
          name: setting.name,
          value: value,
          description: setting.description,
        };

        return acc;
      }, {});

      return res.status(200).json({
        success: true,
        data: formattedSettings,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách cài đặt công khai:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách cài đặt công khai",
      });
    }
  },

  /**
   * Lấy giá trị cài đặt công khai theo key
   */
  async getPublicSettingByKey(req, res) {
    try {
      const { key } = req.params;

      const setting = await Setting.findOne({ key, isPublic: true });

      if (!setting) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy cài đặt hoặc cài đặt không công khai",
        });
      }

      // Chuyển đổi giá trị theo kiểu dữ liệu (nếu cần)
      let value = setting.value;
      // Nếu giá trị đã được lưu đúng kiểu dữ liệu, không cần chuyển đổi
      if (setting.dataType === "number" && typeof value === "string") {
        value = Number(value);
      } else if (setting.dataType === "boolean" && typeof value === "string") {
        value = value === "true";
      } else if (setting.dataType === "json" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (error) {
          console.error(`Lỗi parse JSON cho cài đặt ${setting.key}:`, error);
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          key: setting.key,
          name: setting.name,
          value: value,
          description: setting.description,
          category: setting.category,
        },
      });
    } catch (error) {
      console.error("Lỗi lấy thông tin cài đặt công khai:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin cài đặt công khai",
      });
    }
  },
};

module.exports = settingController;
