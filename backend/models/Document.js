const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    caseId: {
      type: Number,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    courtRef: {
      type: Number,
      required: true,
    },
    requestId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Request"
}

  
  
  },
  { timestamps: true }
);
 
module.exports =
  mongoose.models.Document ||
  mongoose.model("Document", documentSchema);