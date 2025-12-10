const express = require("express");
const router = express.Router();
const Evenement = require("../models/evenement");
const Inscription = require("../models/registration");
const User = require("../models/user");
const mongoose = require("mongoose");

// 🔹 Récupérer tous les événements
router.get("/all", async (req, res) => {
  try {
    const events = await Evenement.find().sort({ date_event: 1 });
    res.json(events);
  } catch (err) {
    console.error("Erreur getAllEventsList:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 🔹 Récupérer les événements d’un utilisateur (organisation ou bénévole)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    let events = [];

    if (user.role === "organisation") {
      // 🔹 Événements de l'organisation
      const orgId = new mongoose.Types.ObjectId(userId);
      events = await Evenement.find({ organisation_id: orgId }).sort({ date_event: 1 });

    } else if (user.role === "benevole") {
      // 🔹 Événements auxquels le bénévole est inscrit
      const userObjId = new mongoose.Types.ObjectId(userId);
      const inscriptions = await Inscription.find({ user_id: userObjId });
      const eventIds = inscriptions.map(i => i.event_id);
      events = await Evenement.find({ _id: { $in: eventIds } }).sort({ date_event: 1 });
    }

    res.json(events);

  } catch (err) {
    console.error("Erreur getEventsByUser:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
