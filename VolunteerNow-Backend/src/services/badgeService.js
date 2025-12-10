const Badge = require("../models/badge");
const UserBadge = require("../models/userBadges");

async function assignBadges(userId, participations) {

    //nombre des évènements dont il a participé
    const total = participations.length;   

    // Extraire les villes
    const villes = new Set(
        participations
            .filter(p => p.localisation || p.localisation !== undefined) // sécurité
            .map(ev => ev.localisation.split(" - ")[0].trim())
    );
    const nbVilles = villes.size;
    
    let niveau = null;
    if (total >= 30 && nbVilles >= 5) niveau = "Platine";
    else if (total >= 20 && nbVilles >= 3) niveau = "Or";
    else if (total >= 15) niveau = "Argent";
    else if (total >= 5) niveau = "bronze";

    //Aucun niveau b'est atteint
    if (!niveau) return;

    //chercher le badge
    const badge = await Badge.findOne({ niveau });
    if (!badge) return;

    //Vérifier si l’utilisateur a déjà ce badge
    const existe = await UserBadge.findOne({
        user_id: userId,
        badge_id: badge._id
    });

    if (existe) return;

    await UserBadge.create({
        user_id: userId,
        badge_id: badge._id
    });

    console.log(`🎉 Badge ${niveau} attribué à ${userId}`); //debug

};


module.exports = assignBadges;