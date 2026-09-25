const express = require("express");

const Event = require("../models/Event");
const {
  buildDashboardSummary,
} = require("../services/dashboardSummary");

const router = express.Router();

// GET /dashboard/summary
router.get("/summary", async (req, res) => {
  try {
    const events = await Event.find({})
      .sort({ shipmentId: 1, version: 1 })
      .lean();

    return res.status(200).json(buildDashboardSummary(events));
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      message: "Failed to build dashboard summary",
      error: error.message,
    });
  }
});

module.exports = router;
