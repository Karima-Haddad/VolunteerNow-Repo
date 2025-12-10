const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Fonction qui gère les messages du chatbot
exports.handleMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || userMessage.trim() === "") {
      return res.status(400).json({ reply: "Votre message est vide." });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es VolunteerBot, l'assistant officiel de la plateforme VolunteerNow en Tunisie. " +
        "Ton rôle est d'aider les utilisateurs (bénévoles et organisations) à utiliser correctement la plateforme. " +
        "Tu réponds toujours en français, avec un ton bienveillant, simple et clair. " +

        "INFORMATIONS IMPORTANTES : " +
        "- Un bénévole participe à un événement en cliquant sur le bouton « Participer » dans la fiche de l'événement. " +
        "- Les statuts possibles d'une candidature sont : en attente, acceptée, refusée. " +
        "- Les badges sont attribués selon le nombre d'événements complétés par le bénévole. " +

        "Pour les organisations : " +
        "Pour devenir partenaire, allez dans la page « À propos », cliquez sur « Devenir partenaire », remplissez les informations demandées (nom, description, contact, etc.), puis validez l'inscription. " +
        "Une fois le compte organisation créé, vous pouvez publier des événements et gérer les candidatures reçues. " +

        "Si une question n'est pas liée à VolunteerNow, tu expliques poliment que tu es spécialisé dans l'aide liée à la plateforme."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Je n'ai pas compris, peux-tu reformuler ?";

    res.json({ reply });

  } catch (err) {
    console.error("Erreur chatbot :", err);
    res.status(500).json({
      reply: "Une erreur est survenue du côté du serveur. Réessaie plus tard."
    });
  }
};