const mongoose = require("mongoose");

const connectDB = require("./config/db");

const {
  replay,
  getEventStream,
} = require("./services/eventStore");

const shipmentReducer = require("./reducers/shipmentReducer");

const run = async () => {
  const shipmentId = "CMD-TEST-001";

  try {
    await connectDB();

    console.log("\nTesting Event Replay...\n");

    const events = await getEventStream(shipmentId);

    if (events.length === 0) {
      console.log("No events found for shipment.");
      return;
    }

    console.log(
      `Events found: ${events.length}`
    );

    events.forEach((event) => {
      console.log(
        `Version ${event.version}: ${event.eventType}`
      );
    });

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

    console.log("\nReconstructed Shipment State:\n");

    console.log(
      JSON.stringify(currentState, null, 2)
    );

    console.log(
      "\nEvent Replay test completed successfully."
    );
  } catch (error) {
    console.error(
      "\nEvent Replay test failed:"
    );

    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
};

run();