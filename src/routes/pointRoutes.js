const express = require("express");
const pointController = require("../controllers/pointController");
const {
  validateEarnPoints,
  validateRedeemPoints,
} = require("../middleware/validate");
const { auth } = require("../middleware/auth");
const keycloakAuth = require("../middleware/keycloakAuth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: API quản lý điểm thưởng
 */

/**
 * @swagger
 * /points/earn:
 *   post:
 *     summary: Tích điểm cho người dùng
 *     description: Thêm điểm thưởng cho người dùng dựa trên hành động
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - scenarioType
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *               scenarioType:
 *                 type: string
 *                 description: Loại hành động tích điểm
 *               metadata:
 *                 type: object
 *                 description: Thông tin bổ sung
 *                 properties:
 *                   courseId:
 *                     type: string
 *                   orderId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Tích điểm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 points:
 *                   type: integer
 *                 totalPoints:
 *                   type: integer
 *                 badgeLevel:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post("/earn", auth, validateEarnPoints, pointController.earnPoints);

/**
 * @swagger
 * /points/redeem:
 *   post:
 *     summary: Đổi điểm thưởng
 *     description: Sử dụng điểm thưởng để đổi lấy phần thưởng hoặc giảm giá
 *     tags: [Points]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - points
 *               - orderId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *               points:
 *                 type: integer
 *                 description: Số điểm muốn đổi
 *               orderId:
 *                 type: string
 *                 description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Đổi điểm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 pointsRedeemed:
 *                   type: integer
 *                 amountConverted:
 *                   type: number
 *                 remainingPoints:
 *                   type: integer
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc số điểm không đủ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post(
  "/redeem",
  auth,
  validateRedeemPoints,
  pointController.redeemPoints
);

/**
 * @swagger
 * /points/balance/{userId}:
 *   get:
 *     summary: Lấy số dư điểm
 *     description: Lấy số dư điểm hiện tại của người dùng
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin số dư điểm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalPoints:
 *                   type: integer
 *                 badgeLevel:
 *                   type: string
 *                 rank:
 *                   type: integer
 *       500:
 *         description: Lỗi server
 */
router.get("/balance/:userId", auth, pointController.getBalance);

/**
 * @swagger
 * /points/history/{userId}:
 *   get:
 *     summary: Lấy lịch sử giao dịch điểm
 *     description: Lấy lịch sử tích điểm và sử dụng điểm của người dùng
 *     tags: [Points]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số trang (mặc định là 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số lượng kết quả trên mỗi trang (mặc định là 10)
 *     responses:
 *       200:
 *         description: Danh sách lịch sử giao dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [EARN, REDEEM]
 *                       points:
 *                         type: integer
 *                       scenarioType:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Lỗi server
 */
router.get("/history/:userId", auth, pointController.getHistory);

module.exports = router;
