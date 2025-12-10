const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/VolunteerNowDB';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Délai d'attente plus court pour les tests
    socketTimeoutMS: 45000, // Délai d'attente des sockets
    connectTimeoutMS: 10000 // Délai de connexion
})
.then(() => {
    console.log("MongoDB connecté ✔");
})
.catch(err => {
    console.error("Erreur de connexion à MongoDB ❌", err.message);
    console.log("URI utilisée :", mongoUri);
    console.log("Vérifiez que MongoDB est bien démarré et accessible à l'adresse indiquée");
});

// Gestion des erreurs après la connexion initiale
mongoose.connection.on('error', err => {
    console.error('Erreur de connexion MongoDB après la connexion initiale:', err);
});

module.exports = mongoose;