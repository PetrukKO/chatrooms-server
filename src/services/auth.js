const dotenv = require("dotenv");
dotenv.config({ path: ".../config.env" });
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userServices = require("../services/user");
const bcrypt = require("bcrypt");

//decodes token
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

async function comparePassword(input_password, hashed_password) {
  const compared = await bcrypt
    .compare(input_password, hashed_password)
    .then((res) => {
      return res;
    });
  return compared;
}

//returns token or throws "incorrect login or password"
async function authorize(login, password) {
  const user = await User.findOne({ login }).exec();
  const isCorrect = await comparePassword(password, user.password).then(
    (res) => {
      return res;
    }
  );
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
}

module.exports = { authorize, decodeToken };
