const User = require("../models/userModel");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const hashed_password = await bcrypt
    .hash(password, process.env.HASH)
    .then((res) => {
      return res;
    });
  return hashed_password;
}

async function createUser(login, password) {
  const hashed_password = await hashPassword(password);
  const user = new User({
    login,
    password: hashed_password,
  });
  await user.save();
  return user;
}

async function findByLogin(login) {
  const found = await User.findOne({ login }).select("-password").exec();
  return found;
}

module.exports = {
  createUser,
  findByLogin,
  hashPassword,
};
