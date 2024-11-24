const dotenv = require("dotenv");
dotenv.config({ path: ".../config.env" });
//const userControllers = require("../controllers/userControllers");
const userServices = require("../services/user");
const authServices = require("../services/auth");

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function getToken(req, res) {
  console.log("get token");
  try {
    const r = await authServices.authorize(req.body.login, req.body.password);
    return res.json({ token: r });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
}

/* async function authorize(login, password) {
  const user = await User.findOne({ login }).exec();
  const isCorrect = await userServices
    .comparePassword(password, user.password)
    .then((res) => {
      return res;
    });
  console.log(isCorrect);
  if (isCorrect) {
    const token = jwt.sign(
      { login: user.login, color: user.color },
      process.env.SECRET,
      { expiresIn: "15m" }
    );
    return token;
  }
  console.log("Incorrect login or password");
  throw "Incorrect login or password";
} */

/* function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
} */

module.exports = { getToken };
