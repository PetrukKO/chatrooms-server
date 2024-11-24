const express = require("express");
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const validators = require("../middlewares/validators");

//create new user
router.post("/create", validators.validateUser(), userControllers.newUser);

router.get("/find", userControllers.findUser);

//sets new color to user
router.patch(
  "/color",
  authMiddleware.verifyToken,
  validators.validateColor(),
  userControllers.setColor
);

module.exports = router;
