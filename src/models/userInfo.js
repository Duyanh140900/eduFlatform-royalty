/**
 * @swagger
 * components:
 *   schemas:
 *     UserInfo:
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
 *         fullName:
 *           type: string
 *           description: Tên đầy đủ của người dùng
 *         email:
 *           type: string
 *           format: email
 *           description: Email của người dùng
 *         avatar:
 *           type: string
 *           description: URL avatar của người dùng
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật thông tin
 */

const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
  },
  avatar: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserInfo", userInfoSchema);
