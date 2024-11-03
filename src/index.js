const express = require("express");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("))");
});

module.exports = app;
