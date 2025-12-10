const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔹 Controllers
const { registerVolunteer, registerOrganization } = require("../controllers/authController");

// 🔹 Créer le dossier uploads/users si non existant
const uploadDir = path.join(__dirname, '../../uploads/users');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Configuration Multer pour stocker les fichiers sur disque dans uploads/users
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

// ===============================
// 🔹 Routes d'inscription
// ===============================
// Bénévole
router.post("/register", upload.single('photo'), registerVolunteer);

// Organisation
router.post("/register-org", upload.single('photo'), registerOrganization);


module.exports = router;
