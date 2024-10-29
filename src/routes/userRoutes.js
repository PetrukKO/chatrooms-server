const express = require("express");
const userControllers = require("../controllers/userControllers");
const authControllers = require("../controllers/authControllers");
const roomControllers = require("../controllers/roomControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const router = express.Router();

router.post("/create", authMiddleware.validateUser(), async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const login = req.body.login;
    const password = req.body.password;
    const exists = await userControllers.findByLogin(login);
    if (exists) {
      return res.json("User already exists");
    }
    const user = await userControllers.createUser(login, password);
    return res.status(201).json(user);
  }
  return res.json(errors);
});

router.get("/find", async (req, res) => {
  const found = await userControllers.findByLogin(req.query.login);
  if (!found) {
    return res.status(404).json("User not found");
  }
  return res.status(200).json(found);
});

router.patch(
  "/color",
  authMiddleware.verifyToken,
  authMiddleware.validateColor(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors);
    }
    const new_color = req.body.color;
    const token = req.body.token;
    const login = await authControllers.decodeToken(token)["login"];
    const user = await User.findOneAndUpdate({ login }, { color: new_color });
    user.color = new_color;
    return res.json(user);
  }
);

module.exports = router;
