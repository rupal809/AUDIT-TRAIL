const mongoose = require("mongoose");
const Event = require("./models/Event");

const testImmutability = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/audittrail");

    // Test update
    await Event.updateOne(
      { shipmentId: "SHIP001" },
      { eventType: "UpdatedEvent" },
    );

    console.log("Update succeeded");
  } catch (error) {
    console.log("Update blocked:", error.message);
  }

  try {
    // Test delete
    await Event.deleteOne({ shipmentId: "SHIP001" });

    console.log("Delete succeeded");
  } catch (error) {
    console.log("Delete blocked:", error.message);
  }

  await mongoose.disconnect();
};

testImmutability();
