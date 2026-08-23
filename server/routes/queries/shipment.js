const express = require("express");
const Event = require("../../models/Event");

const router = express.Router();

// GET /shipment/history/:id
router.get("/history/:id", async (req, res) => {
  try {
    const shipmentId = req.params.id;
    if (!shipmentId || shipmentId.trim() === "") {
      return res.status(400).json({
        message: "Shipment ID is required",
      });
    }

    const history = await Event.find({ shipmentId }).sort({ timestamp: 1 });

    if (history.length === 0) {
      return res.status(404).json({
        message: "Shipment history not found",
      });
    }

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching shipment history:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// GET /shipment/:id
router.get("/:id", async (req, res) => {
  try {
    const shipmentId = req.params.id;

    const shipment = await Event.findOne({ shipmentId }).sort({
      timestamp: -1,
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    res.status(200).json(shipment);
  } catch (error) {
    console.error("Error fetching shipment:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
