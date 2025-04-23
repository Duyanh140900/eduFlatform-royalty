const express = require("express");
const settingController = require("../controllers/settingController");

const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Settings
//  *   description: API quản lý cài đặt hệ thống
//  */

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     PublicSettingResponse:
//  *       type: object
//  *       properties:
//  *         success:
//  *           type: boolean
//  *         data:
//  *           type: object
//  *           description: Danh sách cài đặt được tổ chức theo danh mục
//  */

// /**
//  * @swagger
//  * /settings/public:
//  *   get:
//  *     summary: Lấy tất cả cài đặt công khai
//  *     description: Lấy danh sách tất cả cài đặt có isPublic=true
//  *     tags: [Settings]
//  *     responses:
//  *       200:
//  *         description: Danh sách cài đặt công khai
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/PublicSettingResponse'
//  *       500:
//  *         description: Lỗi server
//  */
// router.get("/public", settingController.getPublicSettings);

// /**
//  * @swagger
//  * /settings/public/{key}:
//  *   get:
//  *     summary: Lấy cài đặt công khai theo key
//  *     description: Lấy thông tin chi tiết của một cài đặt công khai theo key
//  *     tags: [Settings]
//  *     parameters:
//  *       - in: path
//  *         name: key
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Key của cài đặt
//  *     responses:
//  *       200:
//  *         description: Thông tin cài đặt
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     key:
//  *                       type: string
//  *                     name:
//  *                       type: string
//  *                     value:
//  *                       type: string
//  *                     description:
//  *                       type: string
//  *                     category:
//  *                       type: string
//  *       404:
//  *         description: Không tìm thấy cài đặt hoặc cài đặt không công khai
//  *       500:
//  *         description: Lỗi server
//  */
// router.get("/public/:key", settingController.getPublicSettingByKey);

module.exports = router;
