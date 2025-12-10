const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function detectRoleFromEmail(email) {
  const personalDomains = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
    "live.com", "icloud.com", "protonmail.com"
  ];

  const domain = email.split("@")[1];
  return personalDomains.includes(domain) ? "benevole" : "organisation";
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/authgoogle/google/callback",
      passReqToCallback: true,
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const role = detectRoleFromEmail(email);

        let user = await User.findOne({ email });

        // === NOUVEAU USER GOOGLE ===
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            photo: profile.photos?.[0]?.value || null,
            role,
            authProvider: "google"
            // ⛔️ Ne PAS mettre password: null ici
          });
        }

        // 🔥 Génération du JWT
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return done(null, { user, token });

      } catch (err) {
        console.error("Erreur OAuth Google :", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((data, done) => done(null, data));
passport.deserializeUser((data, done) => done(null, data));

module.exports = passport;
