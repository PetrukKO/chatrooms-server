const dotenv = require("dotenv");
dotenv.config({ path: ".../config.env" });
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

//decodes token
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

//checks is password correct
async function comparePassword(input_password, hashed_password) {
  const compared = await bcrypt
    .compare(input_password, hashed_password)
    .then((res) => {
      return res;
    });
  return compared;
}

//returns token if login and password are correct
async function authorize(login, password) {
  const user = await User.findOne({ login }).exec();
  if (!user) {
    throw "User not found";
  }
  const isCorrect = await comparePassword(password, user.password).then(
    (res) => {
      return res;
    }
  );
  if (isCorrect) {
    const token = jwt.sign(
      { login: user.login, color: user.color },
      process.env.SECRET,
      { expiresIn: "15m" }
    );
    return token;
  }
  throw "Incorrect login or password";
}

module.exports = { authorize, decodeToken };
