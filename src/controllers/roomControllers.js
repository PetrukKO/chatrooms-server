const Room = require("../models/roomModel");
const Message = require("../models/messageModel");
const rooms = require("../services/rooms");
const { validationResult } = require("express-validator");

/* async function createRoom(name) {
  const room = new Room({
    name,
  });
  await room.save();
  return room;
} */

/* async function findByName(name) {
  const room = await Room.findOne({ name }).exec();
  return room;
} */

async function createRoom(req, res) {
  //validate user token
  const errors = validationResult(req);
  const name = req.body.name;
  if (errors.isEmpty()) {
    const exists = await rooms.findByName(name);
    console.log(exists);
    //check if room with this name exists
    if (exists) {
      return res.json("Room already exists");
    }
    //create
    const room = await rooms.createRoom(name);
    return res.json(room);
  }
  return res.json(errors);
}

async function findRoom(req, res) {
  const name = req.query.name;
  const found = await rooms.findByName(name);
  if (!found) {
    return res.json("Room not found");
  }
  return res.json(found);
}

async function getMessages(req, res) {
  const room = await Room.findOne({ name: req.params.room }).exec();
  if (!room) {
    return res.json(req.params.room + " Room doesn't exist");
  }
  const messages = await Message.find({ room: room._id })
    .populate("author", "login")
    .exec();
  return res.json(messages);
}

//post message in room
async function postMessage(req, res) {
  const token = req.body.token;
  const message = req.body.message; //message
  const room_name = req.params.room;
  const room = await Room.findOne({ name: room_name }).exec();
  const login = await authControllers.decodeToken(token)["login"];
  const author = await User.findOne({ login }).exec(); //user (object)
  const new_message = await messageControllers.createMessage(
    author,
    room,
    message
  );
  room.messages.push(new_message._id);
  await room.save();
  return res.json(new_message);
}

async function getNMessages(req, res) {
  const token = req.body.token;
  const N = 15;
  const page = req.params.page;
  const room = await Room.findOne({ name: req.params.room }).exec();
  if (!room) {
    return res.json(req.params.room + " Room doesn't exist");
  }
  const messages = (
    await Message.find({ room: room._id })
      .sort([["createdAt", -1]])
      .populate("author", "login")
      .exec()
  ).slice(page * N, page * N + N);
  if (messages.length > 0) {
    return res.json(messages);
  } else {
    return res.status(404).json("Empty page");
  }
}

module.exports = {
  createRoom,
  findRoom,
  getMessages,
  postMessage,
  getNMessages,
};
