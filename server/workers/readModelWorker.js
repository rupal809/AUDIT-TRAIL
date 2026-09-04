const Event = require("../models/Event");
const ShipmentReadModel = require("../models/ShipmentReadModel");

async function processEvents() {
  try {
    const events = await Event.find().sort({ timestamp: 1 });

    for (const event of events) {
      const existingShipment = await ShipmentReadModel.findOne({
        shipmentId: event.shipmentId,
      });

      if (existingShipment && event.version <= existingShipment.version) {
        console.log(`Skipping older event for ${event.shipmentId}`);
        continue;
      }
      const update = {
        shipmentId: event.shipmentId,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };
      switch (event.eventType) {
        case "CREATED":
        case "ShipmentCreated":
          update.status = "Created";
          break;

        case "SHIPPED":
        case "ShipmentShipped":
          update.status = "Shipped";
          break;

        case "IN_TRANSIT":
        case "ShipmentInTransit":
          update.status = "In Transit";
          break;
        case "DELIVERED":
        case "ShipmentDelivered":
          update.status = "Delivered";
          break;

        default:
          console.log(`Unknown event type: ${event.eventType}`);
      }

      if (event.payload) {
        if (event.payload.status) {
          update.status = event.payload.status;
        }

        if (event.payload.location) {
          update.location = event.payload.location;
        }
      }
      await ShipmentReadModel.findOneAndUpdate(
        { shipmentId: event.shipmentId },
        update,
        {
          upsert: true,
          new: true,
        },
      );

      console.log("Processing event:", event.shipmentId, event.eventType);
      console.log("Read model update:", update);
    }
  } catch (error) {
    console.error("Worker error:", error.message);
  }
}

module.exports = { processEvents };
