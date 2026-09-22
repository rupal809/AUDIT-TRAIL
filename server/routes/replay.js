const express = require("express");

const {
  replay,
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

    const currentState = await replay(
      shipmentId,
      shipmentReducer,
      initialState
    );

    if (currentState.version === 0) {
      return res.status(404).json({
        message: "Shipment state not found",
        shipmentId,
      });
    }

    return res.status(200).json({
      message: "Shipment state reconstructed successfully",
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