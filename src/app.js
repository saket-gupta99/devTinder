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

//middleware to turn json to js object
app.use(express.json());

// app.post("/signup", async (req, res) => {
//   //create a new instance of User model
//   const user = new User(req.body);

//   try {
//     await user.save();
//     res.send("User added successfully");
//   } catch (err) {
//     res.status(400).send("Error saving user data");
//   }
// });

//get one user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) res.status(401).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) res.status(401).send("User not found");
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
