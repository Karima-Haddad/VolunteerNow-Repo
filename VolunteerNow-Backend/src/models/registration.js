const mongoose = require("mongoose");

const inscriptionSchema = new mongoose.Schema({

    // 🔗 L'utilisateur qui s'inscrit
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // 🔗 L'événement auquel il s'inscrit
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evenement",
        required: true
    },

    // 📅 Date d'inscription
    date_inscription: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

// 🔒 Empêcher la double inscription
inscriptionSchema.index(
    { user_id: 1, event_id: 1 },
    { unique: true }
);

module.exports = mongoose.model("Inscription", inscriptionSchema);
