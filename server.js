const dotenv = require("dotenv");
const app = require("./src/index.js");
const mongoose = require("mongoose");
dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 3000;

mongoose.connection.on("open", () => {
  console.log("handshake established");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});

app.listen(PORT, () => {
  console.log(`listening ${PORT}`);
  mongoose
    .connect(process.env.CONNECTION_STRING)
    .catch((err) => console.log("connection error"));
});
