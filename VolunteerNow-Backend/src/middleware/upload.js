const multer = require("multer");
const path = require("path");

// Dossier où enregistrer les images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/users"); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + ext;
        cb(null, uniqueName);
    }
});

// Filtrer le type de fichier
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Error("Veuillez uploader une image uniquement"), false);
    }
};

// Export de la config
module.exports = multer({ storage, fileFilter });
