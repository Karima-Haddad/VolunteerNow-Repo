// src/routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const { updateEvent, deleteEvent } = require("../controllers/eventManagementController");

// Modifier le statut d'un événement
router.put("/:id", updateEvent);

// Supprimer un événement
router.delete("/:id", deleteEvent);

module.exports = router;

//zefqf