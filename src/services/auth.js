const dotenv = require("dotenv");
dotenv.config({ path: ".../config.env" });
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const users = require("../services/user");

//decodes token
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

//returns token or throws "incorrect login or password"
async function authorize(login, password) {
  const user = await User.findOne({ login }).exec();
  const isCorrect = await users
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
}

module.exports = { authorize, decodeToken };
