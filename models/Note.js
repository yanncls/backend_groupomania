const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  like: { type: Number, default: 0, required: false },
  usersLiked: { type: [], required: false },
});

module.exports = mongoose.model("Note", noteSchema);
