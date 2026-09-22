const express = require("express");

const {
  appendEvent,
  getCurrentVersion,
  ConcurrencyError,
} = require("../services/eventStore");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const {
      shipmentId,
      origin,
      destination,
      containerType,
      metadata,
    } = req.body;

    if (!shipmentId) {
      return res.status(400).json({
        message: "shipmentId is required",
      });
    }

    if (!origin) {
      return res.status(400).json({
        message: "origin is required",
      });
    }

    if (!destination) {
      return res.status(400).json({
        message: "destination is required",
      });
    }

    const currentVersion =
      await getCurrentVersion(shipmentId);

    if (currentVersion !== 0) {
      return res.status(409).json({
        message: "Shipment already exists",
        shipmentId,
        currentVersion,
      });
    }

    const event = await appendEvent({
      shipmentId,
      eventType: "CONTAINER_CREATED",
      payload: {
        origin,
        destination,
        containerType: containerType || null,
        metadata: metadata || {},
      },
      expectedVersion: 0,
    });

    return res.status(201).json({
      message: "Shipment created successfully",
      event,
    });
  } catch (error) {
    console.error("Create shipment error:", error);

    if (error instanceof ConcurrencyError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to create shipment",
      error: error.message,
    });
  }
});

router.post("/move", async (req, res) => {
  try {
    const {
      shipmentId,
      status,
      location,
      carrier,
      notes,
      expectedVersion,
    } = req.body;

    if (!shipmentId) {
      return res.status(400).json({
        message: "shipmentId is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    if (!location) {
      return res.status(400).json({
        message: "location is required",
      });
    }

    if (
      expectedVersion === undefined ||
      expectedVersion === null
    ) {
      return res.status(400).json({
        message: "expectedVersion is required",
      });
    }

    if (!Number.isInteger(expectedVersion)) {
      return res.status(400).json({
        message: "expectedVersion must be an integer",
      });
    }

    const allowedStatuses = [
      "LOADED_ON_SHIP",
      "ARRIVED_AT_PORT",
      "SHIPMENT_MOVED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid shipment status",
        allowedStatuses,
      });
    }

    const currentVersion =
      await getCurrentVersion(shipmentId);

    if (currentVersion === 0) {
      return res.status(404).json({
        message: "Shipment not found",
        shipmentId,
      });
    }

    const event = await appendEvent({
      shipmentId,
      eventType: status,
      payload: {
        status,
        location,
        carrier: carrier || null,
        notes: notes || null,
      },
      expectedVersion,
    });

    return res.status(201).json({
      message: "Shipment movement recorded successfully",
      event,
    });
  } catch (error) {
    console.error("Move shipment error:", error);

    if (error instanceof ConcurrencyError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to record shipment movement",
      error: error.message,
    });
  }
});

router.post("/temperature", async (req, res) => {
  try {
    const {
      shipmentId,
      temperature,
      unit,
      threshold,
      sensorId,
      expectedVersion,
    } = req.body;

    if (!shipmentId) {
      return res.status(400).json({
        message: "shipmentId is required",
      });
    }

    if (
      temperature === undefined ||
      temperature === null
    ) {
      return res.status(400).json({
        message: "temperature is required",
      });
    }

    if (typeof temperature !== "number") {
      return res.status(400).json({
        message: "temperature must be a number",
      });
    }

    if (
      expectedVersion === undefined ||
      expectedVersion === null
    ) {
      return res.status(400).json({
        message: "expectedVersion is required",
      });
    }

    if (!Number.isInteger(expectedVersion)) {
      return res.status(400).json({
        message: "expectedVersion must be an integer",
      });
    }

    const currentVersion =
      await getCurrentVersion(shipmentId);

    if (currentVersion === 0) {
      return res.status(404).json({
        message: "Shipment not found",
        shipmentId,
      });
    }

    const isSpike =
      typeof threshold === "number"
        ? Math.abs(temperature) > Math.abs(threshold)
        : false;

    const event = await appendEvent({
      shipmentId,
      eventType: "TEMPERATURE_SPIKE",
      payload: {
        temperature,
        unit: unit || "C",
        threshold:
          typeof threshold === "number"
            ? threshold
            : null,
        sensorId: sensorId || null,
        isSpike,
      },
      expectedVersion,
    });

    return res.status(201).json({
      message: "Temperature event recorded successfully",
      event,
    });
  } catch (error) {
    console.error(
      "Temperature event error:",
      error
    );

    if (error instanceof ConcurrencyError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to record temperature event",
      error: error.message,
    });
  }
});

module.exports = router;