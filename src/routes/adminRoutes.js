const express = require("express");
const adminController = require("../controllers/adminController");
const { adminAuth } = require("../middleware/auth");
const { validatePointConfig } = require("../middleware/validate");

const router = express.Router();

// Tất cả các routes đều yêu cầu quyền admin
router.use(adminAuth);

// Point Configs routes
router.get("/point-configs", adminController.getPointConfigs);
router.get("/point-configs/:id", adminController.getPointConfig);
router.post(
  "/point-configs",
  validatePointConfig,
  adminController.createPointConfig
);
router.put("/point-configs/:id", adminController.updatePointConfig);
router.delete("/point-configs/:id", adminController.deletePointConfig);

// Badges routes
router.get("/badges", adminController.getBadges);
router.post("/badges", adminController.createBadge);
router.put("/badges/:id", adminController.updateBadge);

// Statistics routes
router.get("/statistics", adminController.getPointStatistics);

module.exports = router;
