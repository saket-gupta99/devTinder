const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectionDB = async () => {
  await mongoose.connect(process.env.MongoURI);
};

module.exports = connectionDB;
