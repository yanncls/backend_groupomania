const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/profil", auth, userCtrl.getAProfil);
router.get("/profil/:id", auth, userCtrl.getOneUser);
router.put("/profil/:id", auth, userCtrl.modifyProfil);

module.exports = router;
