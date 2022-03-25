const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General note",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;
