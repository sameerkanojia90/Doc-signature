const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  deleteRequest,
  updateRequest,
  uploadFile,
} = require("../controllers/documentController");

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/", isAuthenticated, authorizeRoles("Reader"), uploadFile, createRequest);

router.get("/", isAuthenticated, getAllRequests);

router.delete("/:id", isAuthenticated, authorizeRoles("Reader"), deleteRequest);

router.put("/:id", isAuthenticated, authorizeRoles("Reader"), updateRequest);

module.exports = router;