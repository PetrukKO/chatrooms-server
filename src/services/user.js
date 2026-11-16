const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// bcrypt generates a new random salt for every password when given a number
// of rounds; the salt is stored inside the hash, so bcrypt.compare still works
// for hashes created earlier with the old fixed salt.
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function createUser(login, password) {
  const hashed_password = await hashPassword(password);
  const user = new User({
    login,
    password: hashed_password,
  });
  await user.save();
  // don't send the password hash back to the client
  const result = user.toObject();
  delete result.password;
  return result;
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
