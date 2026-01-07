const Request = require("../models/Request");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const mammoth = require("mammoth");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("templateFile");

exports.uploadFile = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

exports.createRequest = async (req, res) => {
  try {
    const { title, description, createdById, createrRole } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Template file is required" });
    }

    const { value: fileContent } = await mammoth.extractRawText({ path: req.file.path });

    const placeholders = [...fileContent.matchAll(/{(.*?)}/g)].map(
      (match) => `{${match[1].trim()}}`
    );

    const normalizedPlaceholders = placeholders.map((p) =>
      p.replace(/\s+/g, "").toLowerCase()
    );
    const requiredFields = ["{caseid}", "{address}", "{signature}", "{delegationmessage}"];

    const missing = requiredFields.filter((r) => !normalizedPlaceholders.includes(r));
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing placeholders: ${missing.join(", ")}`,
      });
    }

    const folderPath = path.join("uploads", Date.now().toString());
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const templateFilePath = path.join(folderPath, req.file.originalname);
    fs.renameSync(req.file.path, templateFilePath);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([placeholders]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelFilePath = path.join(folderPath, "data.xlsx");
    XLSX.writeFile(workbook, excelFilePath);

    
    const newRequest = new Request({
      Doctitle: title,
      Description: description,
      templateFile: templateFilePath,
      excelDataFile: excelFilePath,
      placeholders,
      createdById: createdById || null,
      createrRole: createrRole || null,
      datafolderPath: folderPath,
      numberOfDocuments: 0,
      rejectedDocuments: 0,
    });

    await newRequest.save();

    res.status(201).json({ success: true, message: "Request created", data: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (fs.existsSync(request.datafolderPath)) {
      fs.rmSync(request.datafolderPath, { recursive: true, force: true });
    }

    await Request.findByIdAndDelete(id);
    res.json({ success: true, message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updated = await Request.findByIdAndUpdate(
      id,
      { Doctitle: title, Description: description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Request not found" });

    res.json({ success: true, message: "Request updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
