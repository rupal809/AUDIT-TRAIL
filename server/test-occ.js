const mongoose = require("mongoose");
const ShipmentReadModel = require("./models/ShipmentReadModel");

const MONGO_URI = "mongodb://127.0.0.1:27017/audittrail";
const BASE_URL = "http://localhost:5000";

async function sendUpdate(data) {
  const response = await fetch(`${BASE_URL}/shipment/update/OCC001`, {
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
async function createTestShipment() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Remove old test shipment
    await ShipmentReadModel.deleteOne({ shipmentId: "OCC001" });

    // Create test shipment
    const shipment = await ShipmentReadModel.create({
      shipmentId: "OCC001",
      status: "Created",
      location: "Hyderabad",
      lastEvent: "ShipmentCreated",
      version: 1,
    });
    console.log("\nOCC Test Started\n");

    // Test 1: Correct version
    const test1 = await sendUpdate({
      status: "Shipped",
      location: "Hyderabad",
      version: 1,
    });

    if (
      test1.status === 200 &&
      test1.body.message === "Shipment updated successfully"
    ) {
      console.log("Test 1: Correct version - PASS");
    } else {
      console.log("Test 1: Correct version - FAIL");
    }

    // Test 2: Stale version
    const test2 = await sendUpdate({
      status: "Delivered",
      location: "Chennai",
      version: 1,
    });

    if (
      test2.status === 409 &&
      test2.body.message === "Update rejected due to version conflict"
    ) {
      console.log("Test 2: Stale version conflict - PASS");
    } else {
      console.log("Test 2: Stale version conflict - FAIL");
    }

    // Test 3: Missing version
    const test3 = await sendUpdate({
      status: "Delivered",
      location: "Chennai",
    });

    if (test3.status === 400 && test3.body.message === "Version is required") {
      console.log("Test 3: Missing version - PASS");
    } else {
      console.log("Test 3: Missing version - FAIL");
    }

    // Test 4: Invalid shipment
    const response = await fetch(`${BASE_URL}/shipment/update/INVALID001`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Delivered",
        location: "Chennai",
        version: 2,
      }),
    });

    const test4 = await response.json();

    if (response.status === 404 && test4.message === "Shipment not found") {
      console.log("Test 4: Invalid shipment - PASS");
    } else {
      console.log("Test 4: Invalid shipment - FAIL");
    }

    console.log("\nOCC Test Completed");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

createTestShipment();
