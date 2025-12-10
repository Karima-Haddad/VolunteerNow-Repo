const Evenement = require("../models/evenement");
const Inscription = require("../models/registration");
const User = require("../models/user");

// 🔹 Tous les événements
exports.getAllEventsList = async (req, res) => {
    try {
        const events = await Evenement.find().sort({ date_event: 1 });
        res.json(events);
    } catch (error) {
        console.error("Erreur getAllEventsList:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// 🔹 Événements d’un utilisateur (bénévole ou organisation)
exports.getEventsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        let events = [];

        if (user.role === 'benevole') {
            // événements où le bénévole est inscrit
            const inscriptions = await Inscription.find({ user_id: userId }).distinct('event_id');
            events = await Evenement.find({ _id: { $in: inscriptions } }).sort({ date_event: 1 });

        } else if (user.role === 'organisation') {
            // événements créés par l'organisation
            events = await Evenement.find({ organisation_id: userId }).sort({ date_event: 1 });
        }

        res.json(events);
    } catch (error) {
        console.error("Erreur getEventsByUser:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
