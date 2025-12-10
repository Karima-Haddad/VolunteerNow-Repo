// controllers/eventManagementController.js
const Evenement = require("../models/evenement");
const mongoose = require("mongoose");

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deleted = await Evenement.findByIdAndDelete(eventId);

    if (!deleted) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json({ message: "Événement supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression événement :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Modifier le statut d'un événement
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { statut } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // ON ACCEPTE LES DEUX FORMATS (majuscules et minuscules)
    const validStatuses = ["Ouvert", "Fermé", "Terminé", "ouvert", "ferme", "termine"];
    if (statut && !validStatuses.includes(statut)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updatedEvent = await Evenement.findByIdAndUpdate(
      eventId,
      { statut },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    return res.status(200).json({
      message: "Événement mis à jour avec succès",
      event: updatedEvent
    });
  } catch (err) {
    console.error("Erreur modification événement :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};