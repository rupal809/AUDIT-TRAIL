const express = require("express");

const {
  appendEvent,
  getEventStream,
  getCurrentVersion,
  ConcurrencyError,
} = require("../services/eventStore");
const { buildHashChain } = require("../utils/hashChain");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      shipmentId,
      eventType,
      payload,
      expectedVersion,
    } = req.body;

    if (!shipmentId) {
      return res.status(400).json({
        message: "shipmentId is required",
      });
    }

    if (!eventType) {
      return res.status(400).json({
        message: "eventType is required",
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

    const event = await appendEvent({
      shipmentId,
      eventType,
      payload: payload || {},
      expectedVersion,
    });

    return res.status(201).json({
      message: "Event appended successfully",
      event,
    });
  } catch (error) {
    console.error("Append event error:", error);

    if (error instanceof ConcurrencyError) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to append event",
      error: error.message,
    });
  }
});

router.get("/:shipmentId", async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const events = await getEventStream(shipmentId);

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event stream not found",
        shipmentId,
      });
    }

    return res.status(200).json({
      shipmentId,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get event stream error:", error);

    return res.status(500).json({
      message: "Failed to get event stream",
      error: error.message,
    });
  }
});

router.get(
  "/:shipmentId/version",
  async (req, res) => {
    try {
      const { shipmentId } = req.params;

      const version =
        await getCurrentVersion(shipmentId);

      return res.status(200).json({
        shipmentId,
        version,
      });
    } catch (error) {
      console.error(
        "Get current version error:",
        error
      );

      return res.status(500).json({
        message: "Failed to get current version",
        error: error.message,
      });
    }
  }
);

// GET /events/:shipmentId/proof
// Returns the SHA-256 hash chain of the event stream (tamper evidence).
router.get("/:shipmentId/proof", async (req, res) => {
  try {
    const { shipmentId } = req.params;

    const events = await getEventStream(shipmentId);

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event stream not found",
        shipmentId,
      });
    }

    return res.status(200).json({
      shipmentId,
      count: events.length,
      ...buildHashChain(events),
    });
  } catch (error) {
    console.error("Get proof error:", error);

    return res.status(500).json({
      message: "Failed to build integrity proof",
      error: error.message,
    });
  }
});

module.exports = router;