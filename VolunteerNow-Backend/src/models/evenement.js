
const mongoose = require("mongoose");

const evenementSchema = new mongoose.Schema({

    organisation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    titre: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    date_event: {
        type: Date,
        required: true
    },

    localisation: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /.+[-–—].+/.test(v);
            },
            message: props => `La valeur "${props.value}" doit contenir au moins un tiret (ex: Alger-Centre)`
        }
    },

    position: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },

    categorie: {
        type: String,
        required: true,
        trim: true
    },

    nb_places: {
        type: Number,
        required: true,
        min: 0
    },

    statut: {
    type: String,
    enum: ["Ouvert", "Fermé", "Terminé"],
    default: "Ouvert",
    required: true
}

}, { timestamps: true });

evenementSchema.index({ organisation_id: 1 });

module.exports = mongoose.model("Evenement", evenementSchema);