const dotenv = require("dotenv");
dotenv.config({ path: ".../config.env" });
const auth = require("../services/auth");

//authorize and get token
async function getToken(req, res) {
  try {
    const r = await auth.authorize(req.body.login, req.body.password);
    return res.json({ token: r });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
}

module.exports = { getToken };
