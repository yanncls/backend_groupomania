const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const user = require("../models/user");

// Création de nouveaux users
exports.signup = (req, res, next) => {
  // vérification username
  if (!req.body.user)
    return res.status(403).json({ message: "entrez votre pseudo" });
  // validator pour vérifier le format mail attendu
  if (!validator.isEmail(req.body.email))
    return res
      .status(403)
      .json({ message: "Le format du mail est incorrect." });
  // validator pour vérifier le format psswrd attendu
  if (validator.isStrongPassword(req.body.password)) {
    // bcrypt hash de password
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const myUser = new user({
          email: req.body.email,
          password: hash,
          user: req.body.user,
          surname: req.body.surname,
        });
        console.log(myUser);

        // sauvegarde dans la bdd
        myUser
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé." }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else
    return res.status(403).json({
      message:
        "Votre mot de passe doit contenir 8 caractères minimum. Une lettre majuscule. Une lettre minuscule. Un chiffre. Un caractère spécial.",
    });
};

// login de l'user
exports.login = (req, res, next) => {
  // recherche du mail associé
  user
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Utilisateur et/ou mot de passe incorrect" });
      }

      // comparer le mdp dans la bdd avec celui de la requête
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Utilisateur et/ou mot de passe incorrect" });
          }
          res.status(200).json({
            // création d'un token pour sécurisé le compte
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ message: "premiere erreur" }));
    })
    .catch((error) => res.status(500).json({ message: "deuxieme erreur" }));
};
