
const mongoose = require("mongoose");

const GeneratedDocumentSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },
  caseId:{
    type: String,
  },
  signature: {
    type: String,
  },
  date: String,
  status: {
    type: String,
    default: "Pending",
  }
});

module.exports = mongoose.model("GeneratedDocument", GeneratedDocumentSchema);