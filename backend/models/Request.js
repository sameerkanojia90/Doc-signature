
const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    Doctitle: { type: String, required: true },        
    Description: { type: String, required: true },  
    templateFile: { type: String, required: true }, 
    excelDataFile: { type: String },               
    placeholders: [String],  
                            
    documents: [
      {
        filePath: String,
        Date: String,
        Customer: String,
        Amount: Number,
        DueDate: String,
        Address: String,
        Court: String,
        CaseId: String,
        ReferenceNumber: String,
        Signature: String,
      },
    ],
    court: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Court",
},
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
