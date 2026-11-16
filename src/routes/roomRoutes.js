const express = require("express");
const roomControllers = require("../controllers/roomControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const { asyncHandler } = require("../middlewares/errorHandler");
const router = express.Router();
const validators = require("../middlewares/validators");

//create new room
router.post(
  "/create",
  authMiddleware.verifyToken,
  validators.validateRoom(),
  asyncHandler(roomControllers.createRoom)
);
//find room by name
router.get("/find", asyncHandler(roomControllers.findRoom));

//get all rooms
router.get("/", asyncHandler(roomControllers.getRooms));

//gets all messages from room
router.get(
  "/:room",
  authMiddleware.verifyToken,
  asyncHandler(roomControllers.getMessages)
);

//post message in room
router.post(
  "/:room",
  authMiddleware.verifyToken,
  validators.validateMessage(),
  asyncHandler(roomControllers.postMessage)
);

//get N messages from room
router.get(
  "/:room/:page",
  authMiddleware.verifyToken,
  asyncHandler(roomControllers.getNMessages)
);

module.exports = router;
