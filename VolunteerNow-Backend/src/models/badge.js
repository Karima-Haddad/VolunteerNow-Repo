// models/badge.js
const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  niveau: {
    type: String,
    enum: ["Bronze", "Argent", "Or", "Platine"],
    required: true,
    unique: true
  },
  
  description: { type: String },
  icon: { type: String, default: "medal" }
}, { timestamps: true });

module.exports = mongoose.model("Badge", badgeSchema);