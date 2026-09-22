const Event = require("../models/Event");
const ShipmentReadModel = require("../models/ShipmentReadModel");

async function processEvents() {
  try {
    const events = await Event.find().sort({ timestamp: 1 });

    for (const event of events) {
      const update = {
        shipmentId: event.shipmentId,
        lastEvent: event.eventType,
        version: event.version,
        updatedAt: event.timestamp,
      };

      if (event.payload) {
        if (event.payload.status) {
          update.status = event.payload.status;
        }

        if (event.payload.location) {
          update.location = event.payload.location;
        }
      }

      console.log("Processing event:", event.shipmentId, event.eventType);
      console.log("Read model update:", update);
    }
  } catch (error) {
    console.error("Worker error:", error.message);
  }
}

module.exports = { processEvents };
