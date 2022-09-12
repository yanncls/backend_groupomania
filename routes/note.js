const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const noteCtrl = require("../controllers/note");
const multer = require("../middleware/multer-config");

router.get("/", auth, noteCtrl.getAllNote);
router.post("/", auth, multer, noteCtrl.createNote);
router.get("/:id", auth, noteCtrl.getMyNotes);
router.get("/search/:id", auth, noteCtrl.getOneNote);
router.put("/:id", auth, multer, noteCtrl.modifyNote);
router.delete("/:id", auth, noteCtrl.deleteNote);
router.post("/:id/like", auth, noteCtrl.like);

module.exports = router;
