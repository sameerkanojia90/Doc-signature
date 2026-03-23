const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    docTitle: { type: String, required: true },
    description: { type: String, required: true },

    templateFile: { type: String, required: true },
    excelDataFile: { type: String },

    placeholders: {
      type: [String],
      default: [],
    },

    documents: [
      {
        filePath: { type: String, required: true },

        date: String,
        customer: String,
        amount: Number,
        dueDate: String,
        address: String,
        court: String,
        caseId: String,
        referenceNumber: String,
        signature: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);