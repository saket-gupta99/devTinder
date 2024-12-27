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

const editUserProfileValidation = (req) => {
  const ALLOWED_EDIT_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "userPhoto",
    "skills",
    "about",
  ];

  return Object.keys(req.body).every((field) =>
    ALLOWED_EDIT_FIELDS.includes(field)
  );
};



module.exports = { signupDataValidation, editUserProfileValidation };
