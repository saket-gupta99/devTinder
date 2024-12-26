const validator = require("validator");

//do necessary data validation 
const signupDataValidation = (req) => {
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
  if (!firstName || !lastName) {
    throw new Error("Enter firstname or lastName");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Enter a valid email!");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password!");
  }
};

module.exports = { signupDataValidation };
