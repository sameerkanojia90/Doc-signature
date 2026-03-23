const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  deleteRequest,
  updateRequest,
  uploadFile,
  alldocument,
} = require("../controllers/documentController");
const Document = require("../models/Document");

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/", isAuthenticated, authorizeRoles("Reader"), uploadFile, createRequest);

router.get("/", isAuthenticated, getAllRequests);
router.get("/all",isAuthenticated,alldocument);

router.delete("/:id", isAuthenticated, authorizeRoles("Reader"), deleteRequest);

router.put("/:id", isAuthenticated, authorizeRoles("Reader"), updateRequest);


router.post("/bulk-upload", async (req, res) => {
  try {
    const { documents } = req.body;
    console.log(documents);

    const result = await Document.insertMany(documents);
    console.log(result);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;