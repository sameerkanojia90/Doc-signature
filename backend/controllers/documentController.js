
const Request = require("../models/Request");
const Document = require('../models/Document');
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
    if (err) return res.status(400).json(
      { success: false,
         message: err.message });
    next();
  });
};

exports.createRequest = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log(req.body);

    const user = req.session.user; 
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Template file is required"
      });
    }

    const { value: fileContent } = await mammoth.extractRawText({
      path: req.file.path
    });

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
      createdById: user._id,     
      createrRole: user.role,    
      courtId: user.courtId,   
       officer: req.body.officerId,  
      datafolderPath: folderPath,
      numberOfDocuments: 0,
      rejectedDocuments: 0,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Request created",
      data: newRequest
    });

  } catch (error) {
    console.error(error);
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

    const formatted = requests.map((doc) => ({
      ...doc.toObject(),
      createdAt: doc.createdAt
        ? new Date(doc.createdAt).toISOString().split("T")[0]
        : null,
    }));

    res.json({ success: true, data: formatted });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getOfficerRequests = async (req, res) => {
  try {
    console.log("LOGGED USER:", req.user);

    const requests = await Document.find();

    console.log("ALL DOCS:", requests);

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};




const GeneratedDocument = require("../models/GeneratedDocument");

exports.signDocument = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File required",
      });
    }

    // ✅ SAVE IN NEW MODEL
    const newDoc = new GeneratedDocument({
      requestId: request._id,
      signature: req.file.filename,
      date: new Date().toISOString().split("T")[0],
      status: "Resolved",
    });

    await newDoc.save();

    res.json({ success: true, data: newDoc });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

exports.rejectDocument = async (req, res) => {
  try {
    const doc = await Request.findById(req.params.id);

    if (!doc) return res.status(404).json({ success: false });

    doc.status = "Rejected";
    await doc.save();

    await GeneratedDocument.updateMany(
      { requestId: doc._id.toString() },
      { status: "Rejected" }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.alldocument = async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    console.log(documents);

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

const mongoose = require("mongoose");

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE ID:", id);

    const deletedDoc = await GeneratedDocument.findByIdAndDelete(id);

    console.log("DELETED DOC:", deletedDoc);

    if (!deletedDoc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};