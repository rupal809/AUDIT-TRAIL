const mongoose = require("mongoose");
const { processEvents } = require("./workers/readModelWorker");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/audittrail");

    console.log("MongoDB Connected");

    await processEvents();

    await mongoose.connection.close();
    console.log("Worker test completed");
  } catch (error) {
    console.error(error.message);
  }
}

run();
