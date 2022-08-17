const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  like: { type: Number, default: 0, required: true },
  usersLiked: { type: [], required: true },
});

module.exports = mongoose.model("Note", noteSchema);
