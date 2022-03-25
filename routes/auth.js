const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { body, validationResult } = require("express-validator");

//secret for jwt token
// const jwtSecret = process.env.JWT_SECRET;
const jwtSecret = "thisismynotesapp";

//Signup Route - Doesn't require authentication
router.post(
  "/signup",
  [
    //checking if it's a valid email
    body("email").isEmail().withMessage("must be a valid email"),
    //checking min password length is 5
    body("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 character"),
    //checking min name length is 5
    body("name")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 character"),
  ],
  async (req, res) => {
    //   res.send(req.body);
    //   console.log(req.body);
    //check whether there are errors in the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check whether a user already exists with the entered email
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
      return res
        .status(400)
        .json({ error: "A user withh this email already exists" });
    }

    try {
      //encrypting password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      // console.log(hash);
      //create a new User
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      await newUser.save();
      //signing jwt token and given back to user
      const token = jwt.sign({ id: newUser._id }, jwtSecret);
      res.json({ token, userName: newUser.name });
      // newUser.save().then(() => res.send(newUser));
    } catch (error) {
      res.json("Internal server error");
    }
  }
);

//login Route - Doesn't require authentication
router.post(
  "/login",
  // res.send("login Route");
  [
    //checking if it's a valid email
    body("email").isEmail().withMessage("must be a valid email"),
    //checking min password length is 5
    body("password")
      .isLength({ min: 5 })
      .exists()
      .withMessage("must be a valid password"),
  ],
  async (req, res) => {
    //   res.send(req.body);
    //   console.log(req.body);
    //check whether there are errors in the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //check whether a user already exists with the entered email
    let user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Please enter valid credentials" });
    }

    //compare password
    const pass = bcrypt.compareSync(req.body.password, user.password);
    if (!pass) {
      return res.status(400).json({ error: "Please enter valid credentials" });
    }

    try {
      //signing jwt token and given back to user
      const token = jwt.sign({ id: user._id }, jwtSecret);
      res.json({ token, userName: user.name });
      // newUser.save().then(() => res.send(newUser));
    } catch (error) {
      res.json("Internal server error");
    }
  }
);

//get user details route - requires authentication
router.get("/getuser", isLoggedIn, async (req, res) => {
  try {
    // res.send("User Details");
    let user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.json("Internal server error");
  }
});

module.exports = router;
