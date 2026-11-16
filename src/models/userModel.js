const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  color: { type: String, default: "#000000" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  messages: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
