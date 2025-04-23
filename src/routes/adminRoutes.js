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
 *     Setting:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của cài đặt
 *         key:
 *           type: string
 *           description: Khóa cài đặt
 *         name:
 *           type: string
 *           description: Tên cài đặt
 *         value:
 *           type: string
 *           description: Giá trị cài đặt
 *         dataType:
 *           type: string
 *           enum: [string, number, boolean, json]
 *           description: Kiểu dữ liệu của giá trị
 *         description:
 *           type: string
 *           description: Mô tả cài đặt
 *         category:
 *           type: string
 *           description: Danh mục cài đặt
 *         isPublic:
 *           type: boolean
 *           description: Cài đặt có công khai hay không
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật gần nhất
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
 *               topPoints:
 *                 type: integer
 *                 description: Top điểm để đạt huy hiệu
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
 *               topPoints:
 *                 type: integer
 *                 description: Top điểm để đạt huy hiệu
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

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     summary: Lấy danh sách cài đặt
 *     description: Lấy tất cả cài đặt trong hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách cài đặt
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
 *                     $ref: '#/components/schemas/Setting'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/settings", adminController.getSettings);

/**
 * @swagger
 * /admin/settings/{key}:
 *   get:
 *     summary: Lấy chi tiết cài đặt
 *     description: Lấy thông tin chi tiết của một cài đặt theo key
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Key của cài đặt
 *     responses:
 *       200:
 *         description: Chi tiết cài đặt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Setting'
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy cài đặt
 *       500:
 *         description: Lỗi server
 */
router.get("/settings/:key", adminController.getSetting);

/**
 * @swagger
 * /admin/settings:
 *   post:
 *     summary: Tạo cài đặt mới
 *     description: Tạo một cài đặt mới trong hệ thống
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
 *               - key
 *               - name
 *               - value
 *             properties:
 *               key:
 *                 type: string
 *                 description: Khóa cài đặt
 *               name:
 *                 type: string
 *                 description: Tên cài đặt
 *               value:
 *                 type: string
 *                 description: Giá trị cài đặt
 *               dataType:
 *                 type: string
 *                 enum: [string, number, boolean, json]
 *                 description: Kiểu dữ liệu của giá trị
 *               description:
 *                 type: string
 *                 description: Mô tả cài đặt
 *               category:
 *                 type: string
 *                 description: Danh mục cài đặt
 *               isPublic:
 *                 type: boolean
 *                 description: Cài đặt có công khai hay không
 *     responses:
 *       201:
 *         description: Tạo cài đặt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Setting'
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.post("/settings", adminController.createSetting);

/**
 * @swagger
 * /admin/settings/{key}:
 *   put:
 *     summary: Cập nhật cài đặt
 *     description: Cập nhật thông tin của một cài đặt
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Key của cài đặt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên cài đặt
 *               value:
 *                 type: string
 *                 description: Giá trị cài đặt
 *               dataType:
 *                 type: string
 *                 enum: [string, number, boolean, json]
 *                 description: Kiểu dữ liệu của giá trị
 *               description:
 *                 type: string
 *                 description: Mô tả cài đặt
 *               category:
 *                 type: string
 *                 description: Danh mục cài đặt
 *               isPublic:
 *                 type: boolean
 *                 description: Cài đặt có công khai hay không
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
 *                   $ref: '#/components/schemas/Setting'
 *                 message:
 *                   type: string
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy cài đặt
 *       500:
 *         description: Lỗi server
 */
router.put("/settings/:key", adminController.updateSetting);

/**
 * @swagger
 * /admin/settings/{key}:
 *   delete:
 *     summary: Xóa cài đặt
 *     description: Xóa một cài đặt khỏi hệ thống
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Key của cài đặt
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
 *         description: Không tìm thấy cài đặt
 *       500:
 *         description: Lỗi server
 */
router.delete("/settings/:key", adminController.deleteSetting);

module.exports = router;
