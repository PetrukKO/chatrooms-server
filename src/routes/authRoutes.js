const express = require("express");
const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/authMiddleware");
const { asyncHandler } = require("../middlewares/errorHandler");
const router = express.Router();

//authorize and get token
router.post("/", asyncHandler(authControllers.getToken));

//check is token valid
router.get("/verify", authMiddleware.verifyToken, async (req, res) => {
  res.json("verification success ");
});

module.exports = router;
