/**
 * @swagger
 * components:
 *   schemas:
 *     PointTransaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID tự động sinh bởi MongoDB
 *         userId:
 *           type: string
 *           description: ID người dùng
 *         type:
 *           type: string
 *           enum: [EARN, REDEEM]
 *           description: Loại giao dịch (Tích điểm hoặc Sử dụng điểm)
 *         points:
 *           type: integer
 *           description: Số điểm (dương khi tích điểm, âm khi sử dụng điểm)
 *         scenarioType:
 *           type: string
 *           description: Loại kịch bản tích/dùng điểm
 *         description:
 *           type: string
 *           description: Mô tả giao dịch
 *         courseId:
 *           type: string
 *           description: ID khóa học (nếu có)
 *         orderId:
 *           type: string
 *           description: ID đơn hàng (nếu có)
 *         amountConverted:
 *           type: number
 *           description: Giá trị quy đổi (cho giao dịch REDEEM)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian giao dịch
 */

const mongoose = require("mongoose");

const pointTransactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["EARN", "REDEEM"],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  scenarioType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  orderId: {
    type: String,
  },
  courseId: {
    type: String,
  },
  amountConverted: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model("PointTransaction", pointTransactionSchema);
