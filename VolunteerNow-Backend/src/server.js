    require('dotenv').config();
    const cors = require('cors');

    // Connection à la DB
    require('./config/connection');

    // Express import
    const express = require('express');
    const app = express(); // ⚡ app doit être défini avant usage

    // IMPORT SESSION
    const session = require("express-session");
    const passport = require("./config/googleStrategy");

    // Middleware CORS
    app.use(cors());

    // Accepter JSON
    app.use(express.json());

    // Session
    app.use(
      session({
        secret: "volunteernow",
        resave: false,
        saveUninitialized: false,
      })
    );

    // passport si nécessaire
  app.use(passport.initialize());
  app.use(passport.session());

    // ===== Routes import =====
    const loginRouter =  require('./routes/login');
    const profileRouter =  require('./routes/profil');
    const googleAuthRouter = require("./routes/googleAuth");
    const eventRouter  = require('./routes/event');
    const authRouter = require("./routes/auth");
    const eventsListRoutes = require("./routes/eventsListRoutes");
    const eventManagementRoutes = require("./routes/eventManagementRoutes"); // <- corrigé ici
    const candidatureRouter = require('./routes/candidature');
    const statsRoute        = require('./routes/statsRoutes');
    const chatbotRoutes     = require("./routes/chatbotRoutes");
    const notificationRoutes = require('./routes/notifications');


    // ===== Route prefix =====
    app.use('/auth', loginRouter);
    app.use('/profil', profileRouter);
    app.use('/authgoogle', googleAuthRouter);
    app.use('/events', eventRouter);
    app.use("/inscription", authRouter);  
    app.use("/events-list", eventsListRoutes);
    app.use("/evenements", eventManagementRoutes);
    app.use('/candidature',candidatureRouter);
    app.use('/stats',      statsRoute);
    app.use("/chatbot",    chatbotRoutes);   
    app.use('/notifications', notificationRoutes);
    const path = require('path');

  // Servir les fichiers uploadés
  app.use('/uploads', express.static(path.join(__dirname,".." ,'uploads')));


  console.log("Routes auth :", authRouter.stack.map(r => r.route && r.route.path));

    // Server listener
    app.listen(3000, () => {
        console.log('server work');   
    });



