const dotenv = require("dotenv");
dotenv.config({ path: ".../config.env" });
const userControllers = require("../controllers/userControllers");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function authorize(login, password) {
  const user = await User.findOne({ login }).exec();
  const isCorrect = await userControllers
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
  return "Incorrect login or password";
}

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

module.exports = { authorize, decodeToken };
