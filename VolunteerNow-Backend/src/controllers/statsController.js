const User = require("../models/user");
const Evenement = require("../models/evenement");
const UserBadge = require("../models/userBadges");



exports.getImpactStats = async (req, res) => {
    try{

        //recuperer et compter les donnees
        const volontairesActifs = await User.countDocuments({ role: "benevole" });               // Vonlotaires actis
        const associationsPartenaires = await User.countDocuments({ role: "organisation" });  // Associations partenaires
        const evenementsRealises = await Evenement.countDocuments({                          // Événements réalisés (terminés OU fermés)
        statut: { $in: ["Fermé", "Terminé"] }
        });
        const badgesGagnes = await UserBadge.countDocuments();                            // Badges gagnés (nombre total de badges assignés)

        res.json({
            volontairesActifs,
            associationsPartenaires,
            evenementsRealises,
            badgesGagnes
        })

    }
    catch (err) {
    console.error("Erreur getImpactStats:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }

}