const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token!!");

    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedMessage;
    if (!id) throw new Error("User doesn't exist");

    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
