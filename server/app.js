require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const queryShipmentRoutes = require("./routes/queries/shipment");
const eventRoutes = require("./routes/events");
const commandShipmentRoutes = require("./routes/shipment");
const replayRoutes = require("./routes/replay");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

// Mounted at "/" (existing tests / Postman) and "/api" (React frontend)
const apiRouter = express.Router();

apiRouter.use("/events", eventRoutes);
apiRouter.use("/shipment", commandShipmentRoutes);
apiRouter.use("/shipment", queryShipmentRoutes);
apiRouter.use("/replay", replayRoutes);
apiRouter.use("/dashboard", dashboardRoutes);

app.use("/api", apiRouter);
app.use("/", apiRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Audit Trail API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Server startup error:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

module.exports = app;