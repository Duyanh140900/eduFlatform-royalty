/**
 * @swagger
 * components:
 *   schemas:
 *     Badge:
 *       type: object
 *       required:
 *         - name
 *         - minPoints
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động sinh bởi MongoDB
 *         name:
 *           type: string
 *           description: Tên huy hiệu
 *         minPoints:
 *           type: integer
 *           description: Số điểm tối thiểu để đạt huy hiệu
 *         topPoints:
 *           type: integer
 *           description: Top điểm để đạt huy hiệu
 *         icon:
 *           type: string
 *           description: Đường dẫn icon của huy hiệu
 *         isActive:
 *           type: boolean
 *           description: Trạng thái kích hoạt của huy hiệu
 *         benefits:
 *           type: array
 *           items:
 *             type: string
 *           description: Danh sách quyền lợi của huy hiệu
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

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  minPoints: {
    type: Number,
    required: false,
  },
  topPoints: {
    type: Number,
    required: false,
  },
  icon: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  benefits: {
    type: [String],
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

module.exports = mongoose.model("Badge", badgeSchema);
