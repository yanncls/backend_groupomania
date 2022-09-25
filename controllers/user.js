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
          isAdmin: false,
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
            isAdmin: user.isAdmin,
            token: jwt.sign(
              {
                userId: user._id,
                isAdmin: user.isAdmin,
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "24h" }
            ),
          });
        })
        .catch((error) => res.status(500).json({ message: "premiere erreur" }));
    })
    .catch((error) => res.status(500).json({ message: "deuxieme erreur" }));
};

// Récupération des infos du compte
exports.getMyProfil = async (req, res, next) => {
  const userId = await req.body.userId;
  try {
    const User = await user.findOne({ _id: userId });
    if (!User)
      return res.status(400).json({ message: "une erreur est survenue bis" });
    res.json(User);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "une erreur s'est produite" });
  }
};

exports.getOneUser = async (req, res, next) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const User = await user.findOne({ _id: userId });
    if (!User) return res.status(202).json({ message: "l'user n'existe pas" });
    res.json(User);
  } catch (error) {
    res.status(402).json({ message: "pas d'objet" });
    res.status(400).json({ message: "un probleme sur getuser" });
  }
};

// Ajout d'informations nom et prénom et picture
exports.modifyProfil = async (req, res, next) => {
  try {
    const newData = { ...req.body };
    if (req.file) {
      newData.picture = `${req.protocol}://${req.get("host")}/images/${
        req.file?.filename
      }`;
    }
    // PASSER L'USER ID DANS L UPDATE
    const result = await user.updateOne({ _id: req.userId }, newData);
    console.log("data recu");
    console.log("and the result is ", result);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "gros probleme", error });
  }
};
