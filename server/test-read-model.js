const mongoose = require("mongoose");
const Event = require("./models/Event");
const ShipmentReadModel = require("./models/ShipmentReadModel");
const { processEvents } = require("./workers/readModelWorker");

async function run() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/audittrail");

    console.log("MongoDB Connected");

    // Create test events for the same shipment
    await Event.create([
      {
        shipmentId: "DAY4TEST",
        eventType: "CREATED",
        version: 1,
        payload: {
          status: "Created",
          location: "Chennai",
        },
      },
      {
        shipmentId: "DAY4TEST",
        eventType: "SHIPPED",
        version: 2,
        payload: {
          status: "Shipped",
          location: "Bangalore",
        },
      },
      {
        shipmentId: "DAY4TEST",
        eventType: "DELIVERED",
        version: 3,
        payload: {
          status: "Delivered",
          location: "Hyderabad",
        },
      },
    ]);

    console.log("Test events created");

    // Run worker
    await processEvents();

    // Check final Read Model
    const result = await ShipmentReadModel.findOne({
      shipmentId: "DAY4TEST",
    });

    console.log("Final Read Model:");
    console.log(result);

    await mongoose.connection.close();
    console.log("Day 4 test completed");
  } catch (error) {
    console.error("Test error:", error.message);
  }
}

run();
