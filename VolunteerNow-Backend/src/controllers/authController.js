const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');

exports.registerVolunteer = async (req, res) => {
  try {
    console.log("===== INSCRIPTION BÉNÉVOLE =====");
    console.log("req.body reçu :", req.body);
    console.log("req.file reçu :", req.file);

    const { email, password, name, role, ville, bio, phone, categories } = req.body;

    // Vérification des champs obligatoires
    if (!email || !password || !name || !ville || !phone || !role) {
      console.log("Erreur : champs obligatoires manquants");
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Vérifier si l'utilisateur existe déjà
    const exist = await User.findOne({ email });
    if (exist) {
      console.log("Erreur : email déjà utilisé");
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe
   //const hashedPassword = await bcrypt.hash(password, 10);

    // Photo par défaut
    const defaultPhoto = "default-avatar.jpg";
    const photoFilename = req.file ? req.file.filename : defaultPhoto;

    // Création de l'utilisateur
    const newUser = new User({
      email,
      password,
      name,
      role,
      ville,
      bio: bio || '',
      phone,
      categories: categories || '',
      photo: photoFilename
    });

    console.log("Nouvel utilisateur prêt à sauvegarder :", newUser);

    await newUser.save();
    console.log("✅ Utilisateur sauvegardé avec succès dans MongoDB");

    return res.status(201).json({
      message: "Inscription bénévole réussie",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        photo: `/uploads/users/${photoFilename}`
      }
    });

  } catch (err) {
    console.error("💥 Erreur serveur lors de l'inscription bénévole :", err);
    return res.status(500).json({ message: "Erreur serveur", error: err.stack });
  }
};

exports.registerOrganization = async (req, res) => {
  try {
    console.log("===== INSCRIPTION ORGANISATION =====");
    console.log("req.body reçu :", req.body);
    console.log("req.file reçu :", req.file);

    const { email, password, name, role, ville, bio, phone, categories, description, email_contact } = req.body;

    if (!email || !password || !name || !ville || !phone || !role) {
      console.log("Erreur : champs obligatoires manquants");
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      console.log("Erreur : email déjà utilisé");
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    const defaultPhoto = "default-avatar.jpg";
    const photoFilename = req.file ? req.file.filename : defaultPhoto;

    const orgInfosObj = {
      description: description || '',
      contact: email_contact || ''
    };

    const newUser = new User({
      email,
      password,
      name,
      role,
      ville,
      bio: bio || '',
      phone,
      categories: categories || '',
      organisation_infos: orgInfosObj,
      photo: photoFilename
    });

    console.log("Nouvelle organisation prête à sauvegarder :", newUser);

    await newUser.save();
    console.log("✅ Organisation sauvegardée avec succès dans MongoDB");

    return res.status(201).json({
      message: "Inscription organisation réussie",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        photo: `/uploads/users/${photoFilename}`
      }
    });

  } catch (err) {
    console.error("💥 Erreur serveur lors de l'inscription organisation :", err);
    return res.status(500).json({ message: "Erreur serveur", error: err.stack });
  }
};
