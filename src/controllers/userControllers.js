const User = require("../models/userModel");
const users = require("../services/user");
const auth = require("../services/auth");
const { validationResult } = require("express-validator");

async function newUser(req, res) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const login = req.body.login;
    const password = req.body.password;
    const exists = await users.findByLogin(login);
    if (exists) {
      return res.json("User already exists");
    }
    const user = await users.createUser(login, password);
    return res.status(201).json(user);
  }
  return res.json(errors);
}

async function findUser(req, res) {
  const found = await users.findByLogin(req.query.login);
  if (!found) {
    return res.status(404).json("User not found");
  }
  return res.status(200).json(found);
}

async function setColor(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors);
  }
  const new_color = req.body.color;
  const token = req.body.token;
  const login = await auth.decodeToken(token)["login"];
  const user = await User.findOneAndUpdate({ login }, { color: new_color });
  user.color = new_color;
  return res.json(user);
}

module.exports = {
  newUser,
  findUser,
  setColor,
};
