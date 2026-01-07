const express = require("express");
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  deleteRequest,
  updateRequest,
  uploadFile,
} = require("../controllers/documentController");

router.get("/", getAllRequests);
router.post("/", uploadFile, createRequest);
router.delete("/:id", deleteRequest); // 🗑 Delete route
router.put("/:id", updateRequest); // ✏️ Edit route

module.exports = router;
