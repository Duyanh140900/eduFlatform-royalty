const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    dataType: {
      type: String,
      enum: ["string", "number", "boolean", "json"],
      default: "string",
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: "general",
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Phương thức để lấy giá trị theo key
settingSchema.statics.getValueByKey = async function (key) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

// Phương thức để cập nhật giá trị theo key
settingSchema.statics.updateValue = async function (key, value) {
  const setting = await this.findOne({ key });
  if (!setting) return null;

  setting.value = value;
  await setting.save();
  return setting;
};

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
