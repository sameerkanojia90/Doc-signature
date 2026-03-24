const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Officer", "Reader"],
        default: "Reader"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    courtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Court"
    },
    court: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Court",
}
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);