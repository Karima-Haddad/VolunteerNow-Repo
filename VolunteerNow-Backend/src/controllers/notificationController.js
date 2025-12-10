const Notification = require("../models/notification");
const Evenement = require("../models/evenement");

exports.getNonTraitees = async (req, res) => {
  try {
    const orgId = req.user._id; // organisation connectée

    // Récupérer les notifications de type "nouvelle_candidature"
    // qui ne sont pas encore lues, et destinées à cette organisation
    const notifications = await Notification.find({
      destinataire_id: orgId,
      type: "nouvelle_candidature",
      lu: false
    })
    .sort({ createdAt: -1 }) // plus récentes en premier
    .populate("donnees.benevole_id", "name email")
    .populate("donnees.evenement_id", "titre localisation");

    res.json({
      count: notifications.length,
      notifications
    });

  } catch (error) {
    console.error("Erreur getNonTraitees:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
