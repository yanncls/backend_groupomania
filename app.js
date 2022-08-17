const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// hide id & password
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(express.json());

const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/note");

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// mongodb connect
mongoose
  .connect(`${process.env.MONGO_DB_ACCESS}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
});

// app.use((req, res, next) => {
//   res.status(201);
//   next();
// });

// app.use((req, res, next) => {
//   res.json({ message: "Votre requête a bien été reçue !" });
//   next();
// });

// app.use((req, res, next) => {
//   console.log("Réponse envoyée avec succès !");
// });

// // laisse l'application lire l'image qui provient du serveur web
// app.use(function (req, res, next) {
//   res.setHeader("Cross-Origin-Resource-Policy", "same-site");
//   next();
// });

// CORS
// app.use(
//   cors({
//     origin: "*",
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content",
//       "Accept",
//       "Content-Type",
//       "Authorization",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   })
// );

// logique de route
// dossier static image
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/notes", noteRoutes);

module.exports = app;
