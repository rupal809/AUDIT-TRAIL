const express = require("express");
const ShipmentReadModel = require("../models/ShipmentReadModel");

const router = express.Router();

// Update shipment using Optimistic Concurrency Control
router.put("/:id", async (req, res) => {
  try {
    const shipmentId = req.params.id;
    const { status, location, version } = req.body;

    // Check version
    if (version === undefined) {
      return res.status(400).json({
        message: "Version is required",
      });
    }

    // Find shipment
    const shipment = await ShipmentReadModel.findOne({ shipmentId });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    // OCC version check
    if (version !== shipment.version) {
      return res.status(409).json({
        message: "Update rejected due to version conflict",
        currentVersion: shipment.version,
      });
    }

    // Update shipment and increase version
    shipment.status = status || shipment.status;
    shipment.location = location || shipment.location;
    shipment.version = shipment.version + 1;
    shipment.updatedAt = new Date();

    await shipment.save();

    res.status(200).json({
      message: "Shipment updated successfully",
      shipment,
    });
  } catch (error) {
    console.error("OCC update error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
