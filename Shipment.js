/**
 * Shipment Command APIs
 *
 * POST /shipment/create
 * POST /shipment/move
 * POST /shipment/temperature
 *
 * Command side of the Audit Trail application.
 * Commands validate the request and append domain events
 * to MongoDB. Query/projector logic should remain separate.
 */

const express = require("express");
const router = express.Router();

const { randomUUID } = require("crypto");

// Change this import if your project uses a different MongoDB connection file.
const Event = require("../../models/Event");

/**
 * Helper: append an event to the event store.
 */
async function appendEvent({
  shipmentId,
  eventType,
  payload,
  userId = "system",
}) {
  const event = await Event.create({
    eventId: randomUUID(),
    aggregateId: shipmentId,
    aggregateType: "Shipment",
    eventType,
    payload,
    userId,
    timestamp: new Date(),
  });

  return event;
}

/**
 * POST /shipment/create
 *
 * Creates a new shipment.
 *
 * Example body:
 * {
 *   "shipmentId": "SHP001",
 *   "origin": "Hyderabad",
 *   "destination": "Mumbai",
 *   "userId": "nithin"
 * }
 */
router.post("/create", async (req, res) => {
  try {
    const {
      shipmentId,
      origin,
      destination,
      userId,
    } = req.body;

    if (!shipmentId || !origin || !destination) {
      return res.status(400).json({
        success: false,
        message: "shipmentId, origin and destination are required",
      });
    }

    const event = await appendEvent({
      shipmentId,
      eventType: "ShipmentCreated",
      payload: {
        shipmentId,
        origin,
        destination,
        status: "CREATED",
      },
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      event,
    });
  } catch (error) {
    console.error("Shipment create error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: error.message,
    });
  }
});

/**
 * POST /shipment/move
 *
 * Moves a shipment from one location to another.
 *
 * Example body:
 * {
 *   "shipmentId": "SHP001",
 *   "from": "Hyderabad",
 *   "to": "Mumbai",
 *   "userId": "nithin"
 * }
 */
router.post("/move", async (req, res) => {
  try {
    const {
      shipmentId,
      from,
      to,
      userId,
    } = req.body;

    if (!shipmentId || !from || !to) {
      return res.status(400).json({
        success: false,
        message: "shipmentId, from and to are required",
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        message: "from and to locations must be different",
      });
    }

    const event = await appendEvent({
      shipmentId,
      eventType: "ShipmentMoved",
      payload: {
        shipmentId,
        from,
        to,
      },
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Shipment moved successfully",
      event,
    });
  } catch (error) {
    console.error("Shipment move error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to move shipment",
      error: error.message,
    });
  }
});

/**
 * POST /shipment/temperature
 *
 * Records a temperature reading for a shipment.
 *
 * Example body:
 * {
 *   "shipmentId": "SHP001",
 *   "temperature": 4.5,
 *   "unit": "C",
 *   "userId": "nithin"
 * }
 */
router.post("/temperature", async (req, res) => {
  try {
    const {
      shipmentId,
      temperature,
      unit = "C",
      userId,
    } = req.body;

    if (!shipmentId || temperature === undefined || temperature === null) {
      return res.status(400).json({
        success: false,
        message: "shipmentId and temperature are required",
      });
    }

    if (typeof temperature !== "number") {
      return res.status(400).json({
        success: false,
        message: "temperature must be a number",
      });
    }

    const event = await appendEvent({
      shipmentId,
      eventType: "ShipmentTemperatureRecorded",
      payload: {
        shipmentId,
        temperature,
        unit,
      },
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Shipment temperature recorded successfully",
      event,
    });
  } catch (error) {
    console.error("Shipment temperature error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record shipment temperature",
      error: error.message,
    });
  }
});

module.exports = router;