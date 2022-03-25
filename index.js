//importing packages
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const notes = require("./routes/notes");
const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

// require("dotenv").config();
console.log(dotenv);

//connecting database
mongoose.connect("mongodb://localhost:27017/mynotes");

// const User = mongoose.model("User", {
//   name: String,
//   email: String,
//   password: String,
// });

// const newUser = new User({
//   name: "Semal1",
//   email: "mahajansemal90.sm@gmail.com",
//   password: "asdfqwer123",
// });
// newUser.save().then(() => console.log("new user created"));

//Routes
app.use("/auth", auth);
app.use("/notes", notes);

// app.get("/", (req, res) => {
//   res.send("Home Url");
//   // res.json({
//   //   name: "semal",
//   //   developer: true,
//   //   age: 25,
//   // });
// });

// app.get("/users", (req, res) => {
//   res.send("users url");
// });

const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
