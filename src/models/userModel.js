const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  login: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  color: { type: String, default: "#000000" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  messages: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
