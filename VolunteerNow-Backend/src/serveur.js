



// const User = require("./models/user");

// app.put("/test/add-user", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         const newUser = await User.create({
//             name,
//             email,
//             password,
//             role
//         });

//         res.json({
//             message: "Utilisateur ajouté avec succès",
//             user: newUser
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur serveur", error });
//     }
// });


// {
//   "name": "Karima Haddad",
//   "email": "karima827@gmail.com",
//   "password": "Karima123",
//   "role": "benevole"
// }

// {
//   "password": "NouveauMotDePasse123"
// }

// Connection to DB
require('./config/connection');

// CORS import 
const cors = require("cors");

// Express import
const express = require('express');
const app = express();

//IMPORT SESSION + PASSPORT
// const session = require("express-session");
// const passport = require("./config/googleStrategy");


// Accept Json Data Type
app.use(express.json());  

// //Passeport
// app.use(
//   session({
//     secret: "volunteernow",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());


// ====================== ROUTES OFFICIELLES ======================
const loginRouter       = require('./routes/login');
const profileRouter     = require('./routes/profil');
// const googleAuthRouter  = require('./routes/googleAuth');
const eventRouter       = require('./routes/event');
const candidatureRouter = require('./routes/candidature');

app.use('/auth',       loginRouter);
app.use('/profil',     profileRouter);
// app.use('/authgoogle', googleAuthRouter);
app.use('/evenements', eventRouter);
app.use('/candidatures',candidatureRouter); // /evenements/:id/participer




// ====================== DEMARRAGE SERVEUR ======================
app.listen(3000, () => {
  console.log('Server work on http://localhost:3000');
});

















// const User = require("./models/user");

// app.put("/test/add-user", async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         const newUser = await User.create({
//             name,
//             email,
//             password,
//             role
//         });

//         res.json({
//             message: "Utilisateur ajouté avec succès",
//             user: newUser
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Erreur serveur", error });
//     }
// });


// {
//   "name": "Karima Haddad",
//   "email": "karima827@gmail.com",
//   "password": "Karima123",
//   "role": "benevole"
// }

// {
//   "password": "NouveauMotDePasse123"
// }

