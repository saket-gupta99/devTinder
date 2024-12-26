const express = require("express");
const connectionDB = require("./config/database");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const { signupDataValidation } = require("./utils/validation");

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

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Enter a valid email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }
    res.send("Login successful!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//get one user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) res.status(404).send("User not found");
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get user by id and update
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "password",
      "age",
      "gender",
      "userPhoto",
      "skills",
      "about",
    ];

    const isUpdatedAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdatedAllowed) throw new Error("Cannot update these fields");

    const users = await User.findByIdAndUpdate(
      userId,
      data,
      { new: true, runValidators: true } // setting 'new' to true returns the updated document and 'runvalidators' checks for validation before updating data
    );
    if (!users) res.status(404).send("User not found");
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//delete one user
app.delete("/user", async (req, res) => {
  try {
    // if _id is -1 it'll sort by newest first and for 1 it'll sort by oldest in collection
    const user = await User.deleteOne({ firstName: "Luigi" }).sort({ _id: -1 });
    if (user.deletedCount === 0) res.status(400).send("Can't find the user");
    res.send("user delelted successfully");
  } catch (err) {
    res.status(400).send("");
  }
});
