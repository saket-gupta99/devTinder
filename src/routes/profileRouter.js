const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const { editUserProfileValidation } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!editUserProfileValidation(req)) {
      throw new Error("Invalid fields update");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} your profile was updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { password: oldPassword } = loggedInUser;
    const {
      oldPassword: inputOldPassword,
      password: newPassword,
      confirmPassword,
    } = req.body;

    if (!inputOldPassword || !newPassword || !confirmPassword)
      throw new Error("All fields are required");

    const isPasswordCorrect = await bcrypt.compare(
      inputOldPassword,
      oldPassword
    );

    if (!isPasswordCorrect) throw new Error("Old password is incorrect!");

    if (newPassword !== confirmPassword)
      throw new Error("new password doesn't match confirm password");

    const isSameAsOldPassword = await bcrypt.compare(newPassword, oldPassword);

    if (isSameAsOldPassword)
      throw new Error("new password cant be same as old password");

    loggedInUser.password = await bcrypt.hash(newPassword, 10);

    await loggedInUser.save();

    res.send("Password updated successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
