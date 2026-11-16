const Room = require("../models/roomModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const rooms = require("../services/rooms");
const messages = require("../services/messages");
const auth = require("../services/auth");
const { validationResult } = require("express-validator");

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

async function getRooms(req, res) {
  const found = await Room.find().exec();
  if (!found) {
    return res.json("Rooms not found");
  }
  return res.json(found);
}

async function getMessages(req, res) {
  const room = await Room.findOne({ name: req.params.room }).exec();
  if (!room) {
    return res.json(req.params.room + " Room doesn't exist");
  }
  const messages = await Message.find({ room: room._id })
    .populate("author", "login color")
    .exec();
  return res.json(messages);
}

//post message in room
async function postMessage(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  const token = req.headers.token;
  const message = req.body.message; //message (already trimmed by validator)
  const room_name = req.params.room;
  const room = await Room.findOne({ name: room_name }).exec();
  if (!room) {
    return res.status(404).json(room_name + " Room doesn't exist");
  }
  const payload = auth.decodeToken(token);
  const author = payload
    ? await User.findOne({ login: payload.login }).exec() //user (object)
    : null;
  if (!author) {
    return res.status(401).json("User not found");
  }
  const new_message = await messages.createMessage(author, room, message);
  room.messages.push(new_message._id);
  await room.save();
  return res.json(new_message);
}

async function getNMessages(req, res) {
  const token = req.headers.token;
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
  getRooms,
  getMessages,
  postMessage,
  getNMessages,
};
