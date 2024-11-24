const { body } = require("express-validator");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config({ path: ".../config.env" });

const verifyToken = async function (req, res, next) {
  const token = req.body.token;
  try {
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (err) {
    res.status(400).json("Verification failed");
  }
};

module.exports = { verifyToken };
