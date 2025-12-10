const Candidature = require("../models/candidature");
const Evenement = require("../models/evenement");
const User = require("../models/user");
const Notification = require("../models/notification"); 
const assignBadges = require("../services/badgeService");

// ==================== BÉNÉVOLE CLIQUE "PARTICIPER" ====================
exports.participer = async (req, res) => {
  try {
    // ✅ récupérer l'id du bénévole depuis req.user fourni par ensureAuth
    const benevoleId = req.user._id;
    const evenementId = req.params.id;

    // Vérifier que l'événement existe
    const evenement = await Evenement.findById(evenementId);
    if (!evenement) return res.status(404).json({ message: "Événement non trouvé" });
    if (evenement.statut !== "Ouvert") {
      return res.status(400).json({ message: "Les inscriptions sont fermées" });
    }

    // Vérifier si le bénévole a déjà postulé
    const deja = await Candidature.findOne({ user_id: benevoleId, event_id: evenementId });
    if (deja) return res.status(400).json({ message: "Tu as déjà postulé" });

    // Créer la candidature
    const candidature = await Candidature.create({
      user_id: benevoleId,
      event_id: evenementId,
      statut: "En attente"
    });

    // Récupérer les infos du bénévole
    const benevole = await User.findById(benevoleId);

    // Notification à l'organisation
    await Notification.create({
      destinataire_id: evenement.organisation_id,
      type: "nouvelle_candidature",
      titre: "Nouvelle candidature",
      message: `${benevole.name} souhaite participer à "${evenement.titre}"`,
      lien: `/evenement/${evenementId}/candidatures`,
      lu: false,
      donnees: {
        benevole_id: benevoleId,
        benevole_nom: benevole.name,
        candidature_id: candidature._id,
        evenement_id: evenementId,
        evenement_titre: evenement.titre,
      }
    });

    res.status(201).json({
      message: "Candidature envoyée avec succès !",
      candidature
    });

  } catch (error) {
    console.error("Erreur participer:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Tu as déjà postulé" });
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==================== ORGA ACCEPTE OU REFUSE UNE CANDIDATURE ====================
exports.updateStatus = async (req, res) => {
  try {
    const { candidatureId } = req.params;
    const { statut } = req.body; // "acceptee" ou "refusee"

    if (!["acceptee", "refusee"].includes(statut)) {
      return res.status(400).json({ message: "Statut invalide. Utilise 'acceptee' ou 'refusee'" });
    }

    const candidature = await Candidature.findById(candidatureId)
      .populate("user_id", "name email")
      .populate("event_id", "titre organisation_id");

    if (!candidature) return res.status(404).json({ message: "Candidature introuvable" });

    // Seule l'organisation propriétaire peut modifier
    if (candidature.event_id.organisation_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé : tu n'es pas l'organisateur" });
    }

    // ✅ Conversion vers une valeur valide pour l'enum Mongoose
    const statutBDD = statut === "acceptee" ? "Acceptée" : "Refusée";
    candidature.statut = statutBDD;
    await candidature.save();

    // Notification au bénévole
    const messageNotif =
      statut === "acceptee"
        ? `Félicitations ! Ta candidature pour "${candidature.event_id.titre}" a été acceptée !`
        : `Ta candidature pour "${candidature.event_id.titre}" a été refusée. Merci pour ton intérêt !`;

    // Marquer la notification de demande comme "lue"
    await Notification.updateOne(
      {
        destinataire_id: req.user._id,
        type: "nouvelle_candidature",
        "donnees.benevole_id": candidature.user_id._id,
        "donnees.evenement_id": candidature.event_id._id,
        lu: false
      },
      { $set: { lu: true } }
    );


    // Si accepté → déclencher les badges
    if (statut === "acceptee") {
      const participations = await Candidature.find({
        user_id: candidature.user_id._id,
        statut: "Acceptée"  // valeur correcte
      }).populate("event_id");

      if (typeof assignBadges === "function") {
        await assignBadges(candidature.user_id._id, participations);
      }
    }

    res.json({
      message: "Statut mis à jour avec succès",
      candidature,
      notification_envoyee_au_benevole: true
    });

  } catch (error) {
    console.error("Erreur updateStatus:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// ==================== RÉCUPÉRER LE STATUT DE LA CANDIDATURE ====================
exports.getCandidatureStatus = async (req, res) => {
  try {
    const userId = req.user._id;       // récupéré depuis le token
    const eventId = req.params.eventId;

    const candidature = await Candidature.findOne({
      user_id: userId,
      event_id: eventId
    });

    if (!candidature) {
      return res.json({ status: "none" });
    }

    return res.json({ status: candidature.statut });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
