const mongoose = require("mongoose");
const ShipmentReadModel = require("./models/ShipmentReadModel");

const MONGO_URI = "mongodb://127.0.0.1:27017/audittrail";
const BASE_URL = "http://localhost:5000";

async function sendUpdate(data) {
  const response = await fetch(`${BASE_URL}/shipment/update/CONCURRENT001`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return {
    status: response.status,
    body: result,
  };
}

async function runConcurrencyTest() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Remove old test shipment
    await ShipmentReadModel.deleteOne({
      shipmentId: "CONCURRENT001",
    });

    // Create test shipment with version 1
    await ShipmentReadModel.create({
      shipmentId: "CONCURRENT001",
      status: "Created",
      location: "Hyderabad",
      lastEvent: "ShipmentCreated",
      version: 1,
    });

    console.log("\nConcurrency Test Started\n");

    // Two clients use the same version
    const clientA = sendUpdate({
      status: "Shipped",
      location: "Hyderabad",
      version: 1,
    });

    const clientB = sendUpdate({
      status: "Delivered",
      location: "Chennai",
      version: 1,
    });

    // Run both requests at the same time
    const results = await Promise.all([clientA, clientB]);

    console.log("Client A:", results[0].status);
    console.log("Client B:", results[1].status);

    const successCount = results.filter(
      (result) => result.status === 200,
    ).length;

    const conflictCount = results.filter(
      (result) => result.status === 409,
    ).length;

    if (successCount === 1 && conflictCount === 1) {
      console.log("\nConcurrent OCC Test: PASS");
    } else {
      console.log("\nConcurrent OCC Test: FAIL");
    }

    // Check final database state
    const finalShipment = await ShipmentReadModel.findOne({
      shipmentId: "CONCURRENT001",
    });

    console.log("\nFinal Shipment:");
    console.log(finalShipment);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

runConcurrencyTest();
