const note = require("../models/Note");
const fs = require("fs");
const user = require("../models/user");

//  afficher les publications
exports.getAllNote = async (req, res, next) => {
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
  try {
    // on vérifie que l'id est correct
    if (!req?.params?.id) {
      return res.status(400).json({ meesage: "L'ID du post est nécessaire" });
    }
    // on recherche la note associé à l'id
    const Note = await note.findOne({ _id: req.params.id }).exec();
    console.log("Note", Note);
    // on isole l'userId
    const userId = req.userId;
    console.log("userId", userId);
    // vérifier si l'userId correspond
    if (req.isAdmin !== true && userId !== Note.userId) {
      res.status(401).json({ message: "Vous n'êtes pas autorisé" });
      return;
    }
    const newData = { ...req.body };
    if (req.file) {
      newData.imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file?.filename
      }`;
    }

    console.log("continue");
    const result = await note.updateOne({ _id: req.params.id }, newData);
    console.log("and the result is ", result);
    res.json(result);
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
    if (req.isAdmin !== true && req.userId !== Note.userId) {
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
  const Note = await note.findOne({ _id: req.params.id });
  const like = req.body.like;
  const user = req.body.userId;
  try {
    // Cas ou l'user like
    // Vérifications
    if (!Note.usersLiked.includes(user)) {
      Note.like++;
      Note.usersLiked.push(user);
      console.log("add", Note);
    }
    // Si l'utilisateur retire son évaluation
    else {
      Note.like--;
      const thisUser = Note.usersLiked.indexOf(user);
      Note.usersLiked.splice(thisUser, 1);
      console.log("delete", Note);
    }
    // Mis à jour
    await note.updateOne(
      { _id: req.params.id },
      {
        usersLiked: Note.usersLiked,
        like: Note.usersLiked.length,
      }
    );
    const result = await note.findOne({ _id: req.params.id });
    console.log("result", result);
    // Sauvegarde de la MAJ
    res.status(201).json({
      message: "L'évaluation de la publication à bien été prise en compte",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
};
