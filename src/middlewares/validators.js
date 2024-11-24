const { body } = require("express-validator");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authControllers = require("../controllers/authControllers");
dotenv.config({ path: ".../config.env" });

function validateUser() {
  return [
    body("login")
      .isLength({ min: 3, max: 20 })
      .withMessage("Login length must be from 3 to 20 symbols")
      .exists()
      .withMessage("Enter login")
      .isAlphanumeric("en-US", { ignore: "_" })
      .withMessage("Invalid name"),
    body("password")
      .isLength({ min: 3, max: 20 })
      .withMessage("Password length must be from 3 to 20 symbols")
      .exists()
      .withMessage("Enter password"),
  ];
}

function validateRoom() {
  return [
    body("name")
      .isLength({ min: 3, max: 20 })
      .withMessage("Name must be from 3 to 20 symbols")
      .exists()
      .withMessage("Enter room's name")
      .isAlphanumeric("en-US", { ignore: "_" })
      .withMessage("Invalid name"),
  ];
}

function validateMessage() {
  return [body("")];
}

function validateColor() {
  return [body("color").isHexColor().withMessage("Invalid color")];
}

module.exports = { validateUser, validateRoom, validateColor };
