const express = require("express");
const roomControllers = require("../controllers/roomControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const validators = require("../middlewares/validators");

//create new room
router.post(
  "/create",
  authMiddleware.verifyToken,
  validators.validateRoom(),
  roomControllers.createRoom
);
//find room by name
router.get("/find", roomControllers.findRoom);

//gets all messages from room
router.get("/:room", authMiddleware.verifyToken, roomControllers.getMessages);

//post message in room
router.post("/:room", authMiddleware.verifyToken, roomControllers.postMessage);

//get N messages from room
router.get(
  "/:room/:page",
  authMiddleware.verifyToken,
  roomControllers.getNMessages
);

module.exports = router;
