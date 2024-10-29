const express = require("express");
const authController = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//authorize and get token
router.get("/", async (req, res) => {
  try {
    const r = await authController.authorize(req.body.login, req.body.password);
    return res.json(r);
  } catch (e) {
    return res.json("error");
  }
});

//check is token valid
router.get("/verify", authMiddleware.verifyToken, async (req, res) => {
  res.json("verification success ");
});

module.exports = router;
