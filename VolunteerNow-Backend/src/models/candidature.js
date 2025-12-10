const mongoose = require("mongoose");

const candidatureSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Evenement",
        required: true
    },

    statut: {
        type: String,
        enum: ["En attente", "Acceptée", "Refusée"],
        default: "En attente"
    },

    date_candidature: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

//Empêcher un user de postuler deux fois au même événement
candidatureSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model("Candidature", candidatureSchema);
