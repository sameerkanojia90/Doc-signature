const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/login", authController.login);

router.get("/auth/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  res.json({
    success: true,
    user: {
      id: req.session.user._id,
      role: req.session.user.role
    }
  });
});

router.post("/court", isAuthenticated, authorizeRoles("Admin"), authController.court);
router.get("/admin/stats", isAuthenticated, authorizeRoles("Admin"), authController.stateUpdate);
router.get(  "/admin/courts-officers", isAuthenticated, authorizeRoles("Admin", "Reader"),authController.getCourtsWithOfficers
);
router.delete("/court/:id", isAuthenticated, authorizeRoles("Admin"), authController.deleteCourt);

router.get("/court", isAuthenticated, authorizeRoles("Admin", "Officer"), authController.getCourts);

router.get("/court/:id", isAuthenticated, authController.getCourtById);

router.post("/court/:courtId/member", isAuthenticated, authorizeRoles("Admin"), authController.addMember);

module.exports = router;