const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    pass: {
        type: String,
        required: true
    },
    role: { type: String, 
        enum: ["Officer", "Reader", "Admin"]
    },
    courtId: {
        
        type: mongoose.Schema.Types.ObjectId, ref: "Court"
    }
}, { timestamps: true });

module.exports = mongoose.model("Admin", UserSchema);