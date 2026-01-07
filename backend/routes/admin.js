const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/login", authController.login);
router.post("/court",authController.court);
router.get("/court", authController.getCourts);
router.post("/court/:courtId/member", authController.addMember);
router.get('/admin/stats', authController.stateUpdate);
router.delete("/court/:id", authController.deleteCourt);
router.get("/court/:id", authController.getCourtById);



module.exports = router;