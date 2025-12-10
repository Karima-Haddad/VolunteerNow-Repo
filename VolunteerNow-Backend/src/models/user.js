const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

// === Sous-document Organisation ===
const organisationInfosSchema = new mongoose.Schema({
    contact: { type: String, default: "" },
    description: { type: String, default: "" }
}, { _id: false });

// === Schéma principal User ===
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        },
        default: null
    },

    role: {
        type: String,
        enum: ['benevole', 'organisation'],
        required: true
    },

    name: { type: String, required: true },
    ville: { type: String, default: "" },
    phone: { type: String, default: "" },

    photo: {
        type: String,
        default: "default-user.png"
    },

    bio: { type: String, default: "" },
    categories: { type: String, default: "" },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },

    organisation_infos: {
        type: organisationInfosSchema,
        default: null
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date

}, { timestamps: true });


// === HASH DU MOT DE PASSE ===
userSchema.pre("save", async function (next) {

    // 🔥 Si Google Auth → créer un mot de passe fictif automatique
    if (this.authProvider === "google" && !this.password) {
        this.password = crypto.randomBytes(20).toString("hex");
    }

    // Ne pas re-hasher si non modifié
    if (!this.isModified("password")) return next();

    // Hasher uniquement si password existe
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

module.exports = mongoose.model("User", userSchema);
