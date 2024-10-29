const Room = require("../models/roomModel");

async function createRoom(name) {
  const room = new Room({
    name,
  });
  await room.save();
  return room;
}

async function findByName(name) {
  const room = await Room.findOne({ name }).exec();
  return room;
}

module.exports = { createRoom, findByName };
