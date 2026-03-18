const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/auth");

router.post("/login", authController.login);

router.post("/court", isAuthenticated, authController.court);
router.get("/court", isAuthenticated, authController.getCourts);
router.post("/court/:courtId/member", isAuthenticated, authController.addMember);
router.get("/admin/stats", isAuthenticated, authController.stateUpdate);
router.delete("/court/:id", isAuthenticated, authController.deleteCourt);
router.get("/court/:id", isAuthenticated, authController.getCourtById);

module.exports = router;