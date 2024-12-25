const express = require("express");
const connectionDB = require("./config/database");
const User = require("./models/user");
const app = express();

connectionDB()
  .then(() => {
    console.log("Connection to DB established successfully...");
    app.listen(3000, () => {
      console.log("Server is listening...");
    });
  })
  .catch((err) => {
    console.log("Couldn't connect to the DB");
  });

app.post("/signup", async (req, res) => {
  //create a new instance of User model
  const user = new User({
    firstName: "Kunal",
    lastName: "Ghorpade",
    email: "kunal@gmail.com",
    password: "kunal@123",
    age: 25,
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving user data");
  }
});
