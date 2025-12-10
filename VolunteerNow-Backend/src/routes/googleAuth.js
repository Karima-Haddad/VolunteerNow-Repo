  const express = require("express");
  const router = express.Router();
  const passport = require("../config/googleStrategy");


  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // 2. Callback après la connexion Google
  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/failed" }),
    (req, res) => {
      const token = req.user.token;

      // Redirection vers Angular avec le token en URL
      res.redirect(`http://localhost:4200/login-success?token=${token}`);
    }
  );

  router.get("/failed", (req, res) => {
    res.status(401).json({ message: "Google login failed" });
  });

  module.exports = router;
