const express = require("express");

const {
  getEventStream,
} = require("../services/eventStore");

const shipmentReducer = require("../reducers/shipmentReducer");

const router = express.Router();

router.get("/:shipmentId/state", async (req, res) => {
  try {
    const { shipmentId } = req.params;

    if (!shipmentId || shipmentId.trim() === "") {
      return res.status(400).json({
        message: "shipmentId is required",
      });
    }

    const initialState = {
      shipmentId,
      status: "UNKNOWN",
      location: null,
      version: 0,
    };

    // Optional point-in-time replay: /replay/:id/state?version=3
    const { version } = req.query;
    let upToVersion = null;

    if (version !== undefined) {
      upToVersion = Number(version);

      if (!Number.isInteger(upToVersion) || upToVersion < 1) {
        return res.status(400).json({
          message: "version must be a positive integer",
        });
      }
    }

    const events = await getEventStream(shipmentId);

    const currentState = events
      .filter(
        (event) =>
          upToVersion === null || event.version <= upToVersion
      )
      .reduce(shipmentReducer, initialState);

    if (currentState.version === 0) {
      return res.status(404).json({
        message: "Shipment state not found",
        shipmentId,
      });
    }

    return res.status(200).json({
      message: "Shipment state reconstructed successfully",
      replayedEvents: currentState.version,
      totalEvents: events.length,
      state: currentState,
    });
  } catch (error) {
    console.error(
      "Replay shipment state error:",
      error
    );

    return res.status(500).json({
      message: "Failed to reconstruct shipment state",
      error: error.message,
    });
  }
});

module.exports = router;