const express = require("express");
const adminController = require("../controllers/adminController");
const { adminAuth } = require("../middleware/auth");
const { validatePointConfig } = require("../middleware/validate");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API quản trị hệ thống
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StatisticsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: integer
 *               description: Tổng số người dùng
 *             totalPoints:
 *               type: integer
 *               description: Tổng số điểm đã cấp
 *             totalRedeemed:
 *               type: integer
 *               description: Tổng số điểm đã sử dụng
 *             totalTransactions:
 *               type: integer
 *               description: Tổng số giao dịch
 *             transactionsByDay:
 *               type: array
 *               description: Thống kê giao dịch theo ngày
 *               items:
 *                 type: object
 */

// Tất cả các routes đều yêu cầu quyền admin
router.use(adminAuth);

/**
 * @swagger
 * /admin/point-configs:
 *   get:
 *     summary: Lấy danh sách cấu hình điểm
 *     description: Lấy tất cả cấu hình tích điểm và quy đổi điểm
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách cấu hình điểm
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
 *                     $ref: '#/components/schemas/PointConfig'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/point-configs", adminController.getPointConfigs);

/**
 * @swagger
 * /admin/point-configs/{id}:
 *   get:
 *     summary: Lấy chi tiết cấu hình điểm
 *     description: Lấy thông tin chi tiết của một cấu hình điểm
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cấu hình điểm
 *     responses:
 *       200:
 *         description: Chi tiết cấu hình điểm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PointConfig'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy cấu hình điểm
 *       500:
 *         description: Lỗi server
 */
router.get("/point-configs/:id", adminController.getPointConfig);

/**
 * @swagger
 * /admin/point-configs:
 *   post:
 *     summary: Tạo cấu hình điểm mới
 *     description: Tạo một cấu hình điểm mới trong hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scenarioType
 *               - name
 *               - pointValue
 *             properties:
 *               scenarioType:
 *                 type: string
 *                 description: Loại kịch bản tích điểm
 *               name:
 *                 type: string
 *                 description: Tên cấu hình
 *               description:
 *                 type: string
 *                 description: Mô tả cấu hình
 *               pointValue:
 *                 type: integer
 *                 description: Giá trị điểm
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *               redemptionRate:
 *                 type: number
 *                 description: Tỷ lệ quy đổi điểm
 *     responses:
 *       201:
 *         description: Tạo cấu hình điểm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PointConfig'
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post(
  "/point-configs",
  validatePointConfig,
  adminController.createPointConfig
);

/**
 * @swagger
 * /admin/point-configs/{id}:
 *   put:
 *     summary: Cập nhật cấu hình điểm
 *     description: Cập nhật thông tin của một cấu hình điểm
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cấu hình điểm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên cấu hình
 *               description:
 *                 type: string
 *                 description: Mô tả cấu hình
 *               pointValue:
 *                 type: integer
 *                 description: Giá trị điểm
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *               redemptionRate:
 *                 type: number
 *                 description: Tỷ lệ quy đổi điểm
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
 *                 data:
 *                   $ref: '#/components/schemas/PointConfig'
 *                 message:
 *                   type: string
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy cấu hình điểm
 *       500:
 *         description: Lỗi server
 */
router.put("/point-configs/:id", adminController.updatePointConfig);

/**
 * @swagger
 * /admin/point-configs/{id}:
 *   delete:
 *     summary: Xóa cấu hình điểm
 *     description: Xóa một cấu hình điểm khỏi hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cấu hình điểm
 *     responses:
 *       200:
 *         description: Xóa thành công
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
 *       404:
 *         description: Không tìm thấy cấu hình điểm
 *       500:
 *         description: Lỗi server
 */
router.delete("/point-configs/:id", adminController.deletePointConfig);

/**
 * @swagger
 * /admin/badges:
 *   get:
 *     summary: Lấy danh sách huy hiệu
 *     description: Lấy tất cả huy hiệu trong hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách huy hiệu
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
 *                     $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/badges", adminController.getBadges);

/**
 * @swagger
 * /admin/badges:
 *   post:
 *     summary: Tạo huy hiệu mới
 *     description: Tạo một huy hiệu mới trong hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - minPoints
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên huy hiệu
 *               minPoints:
 *                 type: integer
 *                 description: Số điểm tối thiểu để đạt huy hiệu
 *               icon:
 *                 type: string
 *                 description: Đường dẫn icon của huy hiệu
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách quyền lợi của huy hiệu
 *     responses:
 *       201:
 *         description: Tạo huy hiệu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Badge'
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post("/badges", adminController.createBadge);

/**
 * @swagger
 * /admin/badges/{id}:
 *   put:
 *     summary: Cập nhật huy hiệu
 *     description: Cập nhật thông tin của một huy hiệu
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của huy hiệu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên huy hiệu
 *               minPoints:
 *                 type: integer
 *                 description: Số điểm tối thiểu để đạt huy hiệu
 *               icon:
 *                 type: string
 *                 description: Đường dẫn icon của huy hiệu
 *               isActive:
 *                 type: boolean
 *                 description: Trạng thái kích hoạt
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách quyền lợi của huy hiệu
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
 *                 data:
 *                   $ref: '#/components/schemas/Badge'
 *                 message:
 *                   type: string
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy huy hiệu
 *       500:
 *         description: Lỗi server
 */
router.put("/badges/:id", adminController.updateBadge);

/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: Lấy thống kê điểm
 *     description: Lấy các thông số thống kê về hệ thống điểm
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê điểm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatisticsResponse'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/statistics", adminController.getPointStatistics);

module.exports = router;
