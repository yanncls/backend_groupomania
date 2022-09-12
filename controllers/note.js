const note = require("../models/Note");
const fs = require("fs");
// const user = require("../models/User");

//  afficher les publications
exports.getAllNote = async (req, res, next) => {
  // if (!req.userId) {
  //   res.status(401).json({ message: "vous n'êtes pas authentifié" });
  // }
  const notes = await note.find();
  if (!notes) return res.status(204).json({ message: "aucun post trouvé" });
  res.json(notes);
};

// afficher une publication
exports.getOneNote = async (req, res, next) => {
  const Note = await note.findOne({ _id: req.params.id });
  if (!Note) return res.status(204).json({ message: "le post n'existe pas" });
  res.json(Note);
};

// afficher mes publications
exports.getMyNotes = async (req, res, next) => {
  // recupere l'id passé en params dans l'url de la note
  const myNotes = await note.find({ userId: req.params.id });
  if (!myNotes)
    return res
      .status(204)
      .json({ message: "les ressources sont inexistantes" });
  res.json(myNotes);
};

//créer une publication
exports.createNote = async (req, res, next) => {
  if (!req.userId || !req.body?.description) {
    return res.status(400).json({ message: "Votre demande est incomplète" });
  }
  try {
    const file = req.file;
    console.log("file", file);
    delete note._id;
    const result = await note.create({
      userId: req.userId,
      description: req.body.description,
      like: 0,
      usersLiked: [],
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    res.status(201).json({ message: "Publication enregistrée" });
    console.log(result);
  } catch (err) {
    res.status(400).json({ err });
  }
};

// Modifier une publication
exports.modifyNote = async (req, res, next) => {
  if (!req?.params?.id) {
    return res.status(400).json({ meesage: "L'ID du post est nécessaire" });
  }
  const Note = await note.findOne({ _id: req.params.id }).exec();
  console.log("Note", Note);
  const userId = req.userId;
  console.log("userId", userId);
  try {
    if (userId === Note.userId) {
      if (req.body?.description) Note.description = req.body.description;
      const result = await Note.save();
      res.json(result);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

// supprimer une publication
exports.deleteNote = async (req, res, next) => {
  const Note = await note.findOne({ _id: req.params.id }).exec();
  try {
    if (!Note) {
      return res.status(400).json({ message: "Publication inexistante" });
    }
    if (req.userId != Note.userId) {
      return res.status(401).json({ message: "Requête non autorisé" });
    }
    Note.deleteOne({ _id: req.params.id });
    res.status(201).json({ message: "Publication supprimé avec succès" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Liker une publication
exports.like = async (req, res, next) => {
  const Note = await note.findOne({ _id: req.params.id }).exec();
  const like = req.body.like;
  const user = req.body.userId;
  try {
    // Cas ou l'user like
    if (like == 1) {
      // Vérifications
      if (!Note.usersLiked.includes(user)) {
        Note.like++;
        Note.usersLiked.push(user);
      }
    }
    // Si l'utilisateur retire son évaluation
    if (like == 0) {
      // S'il retire un like
      if (Note.usersLiked.includes(user)) {
        Note.like--;
        const thisUser = Note.usersLiked.indexOf(user);
        Note.usersLiked.splice(thisUser, 1);
      }
    }
    // Mis à jour
    const result = await Note.updateOne(
      { _id: req.params.id },
      {
        usersLiked: Note.usersLiked,
        like: Note.usersLiked.length,
      }
    );
    // Sauvegarde de la MAJ
    Note.save();
    res.status(201).json({
      message: "L'évaluation de la publication à bien été prise en compte",
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
