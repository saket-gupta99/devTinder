const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const User = require("../models/user");
const { signupDataValidation } = require("../utils/validation");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate fields
    signupDataValidation(req);
    //encrypt password
    const {
      firstName,
      lastName,
      password,
      email,
      age,
      gender,
      userPhoto,
      skills,
      about,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    //create a new instance of User model
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      email,
      age,
      gender,
      userPhoto,
      skills,
      about,
    });

    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Enter a valid email");
    }
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = user.validatePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    //create a cookie and add jwt token to it. the first argument is to send userId to token using which you can find out the user. second is secret code which is specifically for u. you'll use it to get the user later. third argument set the expiry date of jwt token
    const token = user.getJWT();

    res.cookie("token", token, { maxAge: 604800000 }); //cookie expires after 7 days

    res.send("Login successful!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;