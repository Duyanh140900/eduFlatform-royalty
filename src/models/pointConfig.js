const mongoose = require("mongoose");

const pointConfigSchema = new mongoose.Schema({
  scenarioType: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  pointValue: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  redemptionRate: {
    type: Number,
    default: 1000, // 1 điểm = 1000 VNĐ
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PointConfig", pointConfigSchema);
