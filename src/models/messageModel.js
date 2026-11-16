const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  body: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  color: String,
  createdAt: Date,
});
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
