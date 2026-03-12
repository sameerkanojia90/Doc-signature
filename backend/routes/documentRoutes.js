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
router.delete("/:id", deleteRequest); 
router.put("/:id", updateRequest); 

module.exports = router;
