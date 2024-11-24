const Message = require("../models/messageModel");

//creates message and saves into db
async function createMessage(author, room, message) {
  /* console.log(author);
  console.log(room); */
  const new_message = new Message({
    author: author._id,
    room: room._id,
    body: message,
    color: author.color,
    createdAt: Date.now(),
  });
  await new_message.save();

  return new_message;
}

module.exports = { createMessage };
