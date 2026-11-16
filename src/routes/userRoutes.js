const express = require("express");
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const { asyncHandler } = require("../middlewares/errorHandler");
const router = express.Router();
const validators = require("../middlewares/validators");

//create new user
router.post(
  "/create",
  validators.validateUser(),
  asyncHandler(userControllers.newUser)
);

router.get("/find", asyncHandler(userControllers.findUser));

//sets new color to user
router.patch(
  "/color",
  authMiddleware.verifyToken,
  validators.validateColor(),
  asyncHandler(userControllers.setColor)
);

//gets user color with token
router.get(
  "/color",
  authMiddleware.verifyToken,
  asyncHandler(userControllers.getColor)
);

module.exports = router;
