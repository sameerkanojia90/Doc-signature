const express = require("express");
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  deleteRequest,
  uploadFile,
  getOfficerRequests,
  alldocument,
  signDocument,
  rejectDocument,
} = require("../controllers/documentController");

const GeneratedDocument = require("../models/GeneratedDocument");
const XLSX = require("xlsx");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
const uploadExcel = multer({ storage }).single("file");

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/", isAuthenticated, authorizeRoles("Reader"), uploadFile, createRequest);

router.get("/", isAuthenticated, getAllRequests);

router.get("/all", isAuthenticated, alldocument);


router.put("/:id/sign", isAuthenticated, upload.single("signedFile"), signDocument);
router.put("/:id/reject", isAuthenticated, rejectDocument);
router.delete("/:id", isAuthenticated, deleteRequest);
router.get("/officer-requests", isAuthenticated, getOfficerRequests);

router.post("/bulk-upload/:requestId", uploadExcel, async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!requestId || requestId === "null") {
      return res.status(400).json({
        success: false,
        message: "Invalid requestId",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const docs = data.map((item) => ({
      requestId: requestId.toString(),
      caseId: item["Case ID"],
      signature: null,
      date: item["Date"],
      courtRef: item["Court Reference"],
      status: "Pending",
    }));

    const result = await GeneratedDocument.insertMany(docs);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/generated/:requestId", async (req, res) => {
  try {
    const docs = await GeneratedDocument.find({
      requestId: req.params.requestId,
    });

    res.json({
      success: true,
      data: docs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/send/:id", async (req, res) => {
  try {
    const { officerEmail, courtName } = req.body;

    const doc = await GeneratedDocument.findByIdAndUpdate(
      req.params.id,
      {
        officerEmail,
        courtName,
        status: "Sent",
      },
      { new: true }
    );

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/officer-docs", isAuthenticated, async (req, res) => {
  try {
    const docs = await GeneratedDocument.find({
      officerEmail: req.user.email,
    });

    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;