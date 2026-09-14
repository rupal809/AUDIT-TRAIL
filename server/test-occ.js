const mongoose = require("mongoose");
const ShipmentReadModel = require("./models/ShipmentReadModel");

const MONGO_URI = "mongodb://127.0.0.1:27017/audittrail";

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

    console.log("Test shipment created:");
    console.log(shipment);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

createTestShipment();
