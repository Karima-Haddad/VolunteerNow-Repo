const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  destinataire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["nouvelle_candidature", "candidature_traitee", "message"],
    default: "nouvelle_candidature",
  },
  titre: { type: String, required: true },
  message: { type: String, required: true },
  lien: { type: String },        // ex: "/evenement/123/candidatures"
  lu: { type: Boolean, default: false },
  donnees: {
    benevole_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    benevole_nom: String,
    evenement_id: { type: mongoose.Schema.Types.ObjectId, ref: "Evenement" },
    evenement_titre: String,
    candidature_id: { type: mongoose.Schema.Types.ObjectId, ref: "Candidature" }
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);