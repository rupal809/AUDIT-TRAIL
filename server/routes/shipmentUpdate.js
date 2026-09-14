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
    // Atomic OCC update
    const shipment = await ShipmentReadModel.findOneAndUpdate(
      {
        shipmentId,
        version,
      },
      {
        $set: {
          status: status,
          location: location,
          updatedAt: new Date(),
        },
        $inc: {
          version: 1,
        },
      },
      {
        new: true,
      },
    );

    if (!shipment) {
      const existingShipment = await ShipmentReadModel.findOne({ shipmentId });

      if (!existingShipment) {
        return res.status(404).json({
          message: "Shipment not found",
        });
      }

      return res.status(409).json({
        message: "Update rejected due to version conflict",
        currentVersion: existingShipment.version,
      });
    }

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
