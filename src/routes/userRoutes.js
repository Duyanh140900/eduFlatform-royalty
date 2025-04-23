const express = require("express");
const userController = require("../controllers/userController");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserInfo:
 *       type: object
 *       required:
 *         - userId
 *       properties:
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

// /**
//  * @swagger
//  * /users/myInfo:
//  *   get:
//  *     summary: Lấy thông tin người dùng
//  *     description: Lấy thông tin chi tiết của người
//  *     tags: [Users]
//  *     responses:
//  *       200:
//  *         description: Thông tin người dùng
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 data:
//  *                   $ref: '#/components/schemas/UserInfo'
//  *       404:
//  *         description: Không tìm thấy người dùng
//  *       500:
//  *         description: Lỗi server
//  */
// router.get("/myInfo", userController.getMyInfo);

/**
 * @swagger
 * /users/info/{userId}:
 *   get:
 *     summary: Lấy thông tin người dùng
 *     description: Lấy thông tin chi tiết của người dùng từ ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserInfo'
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get("/info/:userId", userController.getUserInfo);

/**
 * @swagger
 * /users/cache:
 *   post:
 *     summary: Cập nhật thông tin người dùng vào cache
 *     description: Cập nhật hoặc tạo mới thông tin người dùng trong cache
 *     tags: [Users]
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
 *             properties:
 *               userId:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
// router.post("/cache", auth, userController.updateUserCache);

// /**
//  * @swagger
//  * /users/cache/bulk:
//  *   post:
//  *     summary: Cập nhật thông tin nhiều người dùng
//  *     description: Cập nhật hàng loạt thông tin người dùng vào cache
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - users
//  *             properties:
//  *               users:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   required:
//  *                     - userId
//  *                   properties:
//  *                     userId:
//  *                       type: string
//  *                     fullName:
//  *                       type: string
//  *                     email:
//  *                       type: string
//  *                     avatar:
//  *                       type: string
//  *     responses:
//  *       200:
//  *         description: Cập nhật thành công
//  *       400:
//  *         description: Dữ liệu không hợp lệ
//  *       401:
//  *         description: Không có quyền truy cập
//  *       500:
//  *         description: Lỗi server
//  */
// router.post("/cache/bulk", auth, userController.bulkUpdateUserCache);

module.exports = router;
