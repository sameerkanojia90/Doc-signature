const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/login", authController.login);

router.post("/court", isAuthenticated, authorizeRoles("Admin"), authController.court);
router.get("/admin/stats", isAuthenticated, authorizeRoles("Admin"), authController.stateUpdate);
router.delete("/court/:id", isAuthenticated, authorizeRoles("Admin"), authController.deleteCourt);

router.get("/court", isAuthenticated, authorizeRoles("Admin", "Officer"), authController.getCourts);

router.get("/court/:id", isAuthenticated, authController.getCourtById);

router.post("/court/:courtId/member", isAuthenticated, authorizeRoles("Admin"), authController.addMember);

module.exports = router;