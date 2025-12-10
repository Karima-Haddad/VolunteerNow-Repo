// const jwt = require("jsonwebtoken");

// const requireLogin = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: "Token manquant" });

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // ajoute les infos du user à req
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Token invalide ou expiré" });
//   }
// };

// module.exports = { requireLogin };



const jwt = require("jsonwebtoken");
const User = require("../models/user");

const requireLogin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token manquant" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Charger le user complet depuis la BD
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    req.user = user; // contient _id, name, role, etc.
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = { requireLogin };
