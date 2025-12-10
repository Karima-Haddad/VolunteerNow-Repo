const User = require("../models/user");
const bcrypt = require("bcrypt");      // for Password encryption
const jwt = require('jsonwebtoken');   // Tokens
const nodemailer = require("nodemailer"); // For sendig mails
const crypto = require("crypto");         //Token generation

exports.login = async (req, res) => {
    try{

        //Récuperer l'email et le mdp
        const { email, password } = req.body;

        //Vérifier le mail
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Email ou mot de passe incorrect" });
        }

        //Vérifier le mdp
        const isMatching = await bcrypt.compare(password,user.password);
        if(!isMatching){
            return res.status(400).json({ message: "Email ou Mot de passe incorrect" });
        }

        //Générer le token
        const token = jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );

        res.json({ message: "Connexion réussie",
                    token,
                    user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    authProvider: user.authProvider
                }});

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err });
    }

};


exports.forgotPassword = async (req, res) => {
    try{

        //recupérer l'email
        const { email } = req.body;

        //vérifier l'email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: "Email introuvable" });
        }

        //générer le token
        const resetToken = crypto.randomBytes(32).toString('hex');

        //enregister le token avec date de validité
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        //URL de réinitialisation
        const resetURL = `http://localhost:4200/Reinitialiser-mot-de-passe/${resetToken}`;

        //envoyer email de réinitialisation
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            to: email,
            subject: "Réinitialisation du mot de passe",
            html:`
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f7f7f7; padding: 20px; border-radius: 10px;">

                <!-- Header -->
                <div style="background: #0097A7; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h2 style="color: white; margin: 0;">VolunteerNow</h2>
                </div>

                <!-- Content -->
                <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                    
                    <p style="font-size: 16px; color: #333;">Bonjour <strong>${user.name}</strong>,</p>

                    <p style="font-size: 15px; color: #555; line-height: 1.6;">
                    Vous avez demandé la réinitialisation de votre mot de passe sur la plateforme <strong>VolunteerNow</strong>.
                    </p>

                    <p style="font-size: 15px; color: #555; line-height: 1.6;">
                    Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien est valable pendant <strong>1 heure</strong>.
                    </p>

                    <!-- Button -->
                    <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetURL}" 
                        style="background: #FFA500; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                        Réinitialiser mon mot de passe
                    </a>
                    </div>

                    <p style="font-size: 14px; color: #777; line-height: 1.6;">
                    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email. Aucune modification ne sera faite.
                    </p>

                    <!-- Footer -->
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="text-align: center; font-size: 13px; color: #999;">
                    © 2025 VolunteerNow — Tous droits réservés.<br>
                    Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                    </p>

                </div>

                </div>
            `
        });

        res.json({message: "Email envoyé avec succès" });

    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Erreur Serveur", error});
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        //  Vérifier si un utilisateur existe avec ce token ET que le token n'a pas expiré
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  
        });

        if (!user) {
            return res.status(400).json({ message: "Token invalide ou expiré" });
        }

        // Hasher le nouveau mot de passe
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(password, salt);
        user.password = password;

        // Supprimer le token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Sauvegarder
        await user.save();

        res.json({ message: "Mot de passe modifié avec succès" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
