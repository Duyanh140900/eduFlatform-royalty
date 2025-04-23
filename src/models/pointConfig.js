/**
 * @swagger
 * components:
 *   schemas:
 *     PointConfig:
 *       type: object
 *       required:
 *         - scenarioType
 *         - name
 *         - pointValue
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động sinh bởi MongoDB
 *         scenarioType:
 *           type: string
 *           description: Loại kịch bản để tích/dùng điểm
 *         name:
 *           type: string
 *           description: Tên cấu hình
 *         description:
 *           type: string
 *           description: Mô tả cấu hình
 *         pointValue:
 *           type: integer
 *           description: Giá trị điểm cho kịch bản này
 *         isActive:
 *           type: boolean
 *           description: Trạng thái kích hoạt cấu hình
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
 */

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
