const express = require("express");
const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//authorize and get token
router.post("/", authControllers.getToken);

//check is token valid
router.get("/verify", authMiddleware.verifyToken, async (req, res) => {
  res.json("verification success ");
});

module.exports = router;
