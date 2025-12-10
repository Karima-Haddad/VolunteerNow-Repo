const mongoose = require("mongoose");

const userBadgeSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",                         // relation avec User
        required: true
    },

    badge_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",                        // relation avec Badge
        required: true
    },

    date_obtention: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });   



module.exports = mongoose.model("UserBadge", userBadgeSchema);