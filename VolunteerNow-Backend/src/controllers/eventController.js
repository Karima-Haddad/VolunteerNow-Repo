const mongoose = require('mongoose');
const { Types } = mongoose;

// eventController.js
const Evenement = require('../models/evenement');
const User = require('../models/user');
const Badge = require('../models/badge');
const UserBadge = require('../models/userBadges');

// Récupérer un événement par son ID
exports.getEventById = async (req, res) => {
    try {
        const id = req.params.id;

        const event = await Evenement.findById(id)
            .populate("organisation_id", "name email phone ville photo organisation_infos")
            .exec();

        if (!event) {
            return res.status(404).json({ message: "Événement introuvable" });
        }

        res.json(event);

    } catch (err) {
        console.error("Erreur getEventById:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer les positions (latitude/longitude) de tous les événements
exports.getEventsPositions = async (req, res) => {
    try {
        const events = await Evenement.find({}, {
            _id: 1,
            titre: 1,
            localisation: 1,
            position: 1
        });

        res.json(events);

    } catch (err) {
        console.error("Erreur getEventsPositions:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.createEvenement = async (req, res) => {
  try {
    console.log("BODY RECU :", req.body);

    const {
      titre,
      description,
      date_event,
      localisation,
      categorie,
      nb_places,
      latitude,
      longitude,
      organisation_id  // ← envoyé par le frontend
    } = req.body;

    // Validation simple
    if (!organisation_id) {
      return res.status(400).json({ message: "organisation_id manquant" });
    }

    const newEvent = new Evenement({
      organisation_id,
      titre,
      description,
      date_event,
      localisation,
      position: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      categorie,
      nb_places: Number(nb_places) || 10,
      statut: 'Ouvert'
    });

    const saved = await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Événement créé !",
      event: saved
    });

  } catch (err) {
    console.error("Erreur création événement :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};





// Récupérer tous les événements
exports.getEvents = async (req, res) => {
    try {
        const events = await Evenement.find()
            .populate("organisation_id", "name organisation_infos");
        res.status(200).json(events);
    } catch (err) {
        console.error("Erreur getEvents:", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};