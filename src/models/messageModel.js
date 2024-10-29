const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", require: true },
  body: {
    type: String,
    require: true,
  },
  color: String,
  createdAt: Date,
});
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
