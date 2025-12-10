// event.js
const express = require("express");
const router = express.Router();



const {
    createEvenement,
    createEvent,
    getEventById,
    getEventsPositions,
    getEvents
} = require("../controllers/eventController");


router.post("/create", createEvenement);
router.get("/", getEvents);
router.get("/localisations", getEventsPositions);
router.get("/:id", getEventById);


module.exports = router;


// ====================== ROUTES DE TEST ======================

// // Test simple
// router.post("/test", (req, res) => {
//     console.log("🔥 ROUTE /evenements/test OK !");
//     res.json({ message: "Route test OK" });
// });


// // ====================== ROUTE TEST BADGE (TEMPORAIRE) ======================
// const UserBadge = require("../models/userBadges");
// const Badge = require("../models/badge");
// const Evenement = require("../models/evenement");

// router.post("/test-add", async (req, res) => {
//     try {
//         const {
//             organisation_id,
//             titre,
//             description,
//             date_event,
//             localisation,
//             latitude,
//             longitude,
//             categorie,
//             nb_places
//         } = req.body;

//         if (!organisation_id) {
//             return res.status(400).json({ message: "organisation_id est requis" });
//         }

//         // 1️⃣ créer l'événement
//         const newEvent = await Evenement.create({
//             organisation_id,
//             titre,
//             description,
//             date_event,
//             localisation,
//             position: { latitude, longitude },
//             categorie,
//             nb_places,
//             statut: "Ouvert" // valeur par défaut
//         });

//         // 2️⃣ compter les événements de cette organisation
//         const count = await Evenement.countDocuments({ organisation_id });

//         // 3️⃣ badge bronze au 10e événement
//         let badgeAwarded = null;

//         if (count === 10) {
//             const badge = await Badge.findOne({ niveau: "Bronze" });

//             if (badge) {
//                 await UserBadge.create({
//                     user_id: organisation_id,
//                     badge_id: badge._id
//                 });

//                 badgeAwarded = "Bronze";
//             }
//         }

//         res.json({
//             success: true,
//             message: `Événement ajouté avec succès ! Total = ${count}`,
//             badge: badgeAwarded,
//             event: newEvent
//         });

//     } catch (error) {
//         console.error("❌ Erreur test-add:", error);
//         res.status(500).json({ message: "Erreur serveur", error });
//     }
// });


