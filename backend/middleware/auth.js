

const authController = require("../controllers/authController");

exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Login first"
    });
  }

  req.user = req.session.user;
  next();
};