/**
 * @swagger
 * components:
 *   schemas:
 *     UserPoint:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động sinh bởi MongoDB
 *         userId:
 *           type: string
 *           description: ID người dùng
 *         totalPoints:
 *           type: integer
 *           description: Tổng số điểm hiện tại
 *         badgeLevel:
 *           type: string
 *           description: Cấp độ huy hiệu
 *         rank:
 *           type: integer
 *           description: Thứ hạng hiện tại
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

const userPointSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model("UserPoint", userPointSchema);
