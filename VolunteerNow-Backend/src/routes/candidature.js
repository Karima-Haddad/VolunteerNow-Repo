const express = require("express");
const router = express.Router();

// Importer les controllers
const { participer, updateStatus, getCandidatureStatus } = require("../controllers/candidatureController");

// Importer le middleware corrigé
const { requireLogin } = require("../middleware/auth");

// ROUTES
router.post("/evenements/:id/participer", requireLogin, participer); // 🔑 Ajout du middleware
router.patch("/candidatures/:candidatureId/status", requireLogin, updateStatus);
router.get("/status/:eventId", requireLogin, getCandidatureStatus);

module.exports = router;
