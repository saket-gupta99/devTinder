const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 50,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter strong password!");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator(value) {
          //there's validator for email too
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    age: {
      type: Number,
      trim: true,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Enter a valid gender");
        }
      },
    },
    userPhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid url");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 15)
          throw new Error("Skills should be less than or equal to 15");
      },
    },
    about: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
