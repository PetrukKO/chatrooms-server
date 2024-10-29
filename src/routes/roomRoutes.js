const express = require("express");
const roomControllers = require("../controllers/roomControllers");
const authControllers = require("../controllers/authControllers");
const messageControllers = require("../controllers/messageControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const Room = require("../models/roomModel");
const Message = require("../models/messageModel");
const router = express.Router();

//checks token and body to create new room
router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.validateRoom(),
  async (req, res) => {
    //validate user token
    const errors = validationResult(req);
    const name = req.body.name;
    if (errors.isEmpty()) {
      const exists = await roomControllers.findByName(name);
      console.log(exists);
      //check if room with this name exists
      if (exists) {
        return res.json("Room already exists");
      }
      //create
      const room = await roomControllers.createRoom(name);
      return res.json(room);
    }
    return res.json(errors);
  }
);

router.get("/find", async (req, res) => {
  const name = req.query.name;
  const found = await roomControllers.findByName(name);
  if (!found) {
    return res.json("Room not found");
  }
  return res.json(found);
});

//takes user from token, adds room's id to user's db and user's id to room's db.
//remove user's name from old room's users array

/* router.patch("/:room/join", authMiddleware.verifyToken, async (req, res) => {
  const token = req.body.token;
  //get new room with users
  const room = await Room.findOne({ name: req.params.room }).exec();
  if (!room) {
    return res.json("Room not found");
  }
  const login = await authControllers.decodeToken(token)["login"];
  const user = await User.findOne({ login }).populate("room").exec();
  //get user with old room
  if (user.room) {
    const old_room = await Room.findOne({ name: user.room.name }).exec();
    //remove user's id from old room
    const old_room_users = old_room.users.map((x) => x._id.toString());
    const index = old_room_users.indexOf(user._id.toString());
    if (index > -1) {
      old_room.users.splice(index, 1);
      old_room.save();
    }
  }
  //add user's id to new room
  room.users.push(user);
  await room.save();
  //add room's id to user
  user.room = room._id;
  await user.save();
  return res.json(user);
}); */

router.get("/:room", authMiddleware.verifyToken, async (req, res) => {
  const room = await Room.findOne({ name: req.params.room }).exec();
  if (!room) {
    return res.json(req.params.room + " Room doesn't exist");
  }
  const messages = await Message.find({ room: room._id })
    .populate("author", "login")
    .exec();
  return res.json(messages);
});

router.post("/:room", authMiddleware.verifyToken, async (req, res) => {
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
});

module.exports = router;
