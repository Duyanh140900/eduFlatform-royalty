const express = require("express");
const rankingController = require("../controllers/rankingController");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: API quản lý bảng xếp hạng
 */

/**
 * @swagger
 * /rankings:
 *   get:
 *     summary: Lấy bảng xếp hạng
 *     description: Lấy bảng xếp hạng người dùng theo khoảng thời gian
 *     tags: [Rankings]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Khoảng thời gian (mặc định là month)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số lượng kết quả trả về (mặc định là 10)
 *     responses:
 *       200:
 *         description: Danh sách xếp hạng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 timeRange:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       userId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       totalPoints:
 *                         type: integer
 *                       badgeLevel:
 *                         type: string
 *                       avatar:
 *                         type: string
 *       500:
 *         description: Lỗi server
 */
router.get("/", rankingController.getRankings);

/**
 * @swagger
 * /rankings/{userId}:
 *   get:
 *     summary: Lấy xếp hạng của người dùng
 *     description: Lấy thông tin xếp hạng của một người dùng cụ thể
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *         description: Khoảng thời gian (mặc định là month)
 *     responses:
 *       200:
 *         description: Thông tin xếp hạng người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *                 totalPoints:
 *                   type: integer
 *                 badgeLevel:
 *                   type: string
 *                 globalRank:
 *                   type: integer
 *                 timeRange:
 *                   type: string
 *                 periodPoints:
 *                   type: integer
 *                 periodRank:
 *                   type: integer
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get("/:userId", rankingController.getUserRanking);

/**
 * @swagger
 * /rankings/update:
 *   post:
 *     summary: Cập nhật bảng xếp hạng
 *     description: Cập nhật xếp hạng cho tất cả người dùng
 *     tags: [Rankings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post("/update", auth, rankingController.updateRankings);

module.exports = router;
