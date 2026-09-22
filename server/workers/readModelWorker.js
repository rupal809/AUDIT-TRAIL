const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Event = require("../models/Event");
const ShipmentReadModel = require("../models/ShipmentReadModel");
const shipmentReducer = require("../reducers/shipmentReducer");

const projectShipment = async (shipmentId) => {
  const events = await Event.find({ shipmentId })
    .sort({ version: 1 })
    .lean();

  if (events.length === 0) {
    return null;
  }

  const initialState = {
    shipmentId,
    status: "UNKNOWN",
    location: null,
    version: 0,
  };

  const currentState = events.reduce(
    (state, event) => shipmentReducer(state, event),
    initialState
  );

  return currentState;
};

const updateReadModel = async (shipmentId) => {
  const currentState = await projectShipment(shipmentId);

  if (!currentState) {
    return null;
  }

  const readModel = await ShipmentReadModel.findOneAndUpdate(
    { shipmentId },
    {
      $set: {
        ...currentState,
        updatedAt: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return readModel;
};

const rebuildAllReadModels = async () => {
  const shipmentIds = await Event.distinct("shipmentId");

  console.log(
    `Found ${shipmentIds.length} shipment(s).`
  );

  for (const shipmentId of shipmentIds) {
    const readModel = await updateReadModel(shipmentId);

    if (readModel) {
      console.log(
        `Read model updated: ${shipmentId} | Version: ${readModel.version}`
      );
    }
  }
};

const run = async () => {
  try {
    await connectDB();

    console.log("\nRebuilding Shipment Read Models...\n");

    await rebuildAllReadModels();

    console.log(
      "\nRead Model Worker completed successfully."
    );
  } catch (error) {
    console.error(
      "\nRead Model Worker failed:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
  }
};

run();

module.exports = {
  projectShipment,
  updateReadModel,
  rebuildAllReadModels,
};