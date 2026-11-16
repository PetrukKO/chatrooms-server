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
      return res.status(409).json("User already exists");
    }
    const user = await users.createUser(login, password);
    return res.status(201).json(user);
  }
  return res.status(400).json(errors);
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
  const token = req.headers.token;
  const payload = auth.decodeToken(token);
  if (!payload) {
    return res.status(401).json("Invalid token");
  }
  // new: true returns the updated document; password hash is never sent back
  const user = await User.findOneAndUpdate(
    { login: payload.login },
    { color: new_color },
    { new: true }
  )
    .select("-password")
    .exec();
  if (!user) {
    return res.status(404).json("User not found");
  }
  return res.json(user);
}

async function getColor(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors);
  }

  const token = req.headers.token;
  const payload = auth.decodeToken(token);
  if (!payload) {
    return res.status(401).json("Invalid token");
  }
  const color = await User.findOne({ login: payload.login })
    .select("color")
    .exec();
  if (!color) {
    return res.status(404).json("User not found");
  }
  return res.json(color);
}

module.exports = {
  newUser,
  findUser,
  setColor,
  getColor,
};
