const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/audittrail";

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);

  console.log("MongoDB Connected");
};

module.exports = connectDB;
