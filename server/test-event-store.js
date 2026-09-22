const mongoose = require("mongoose");

const {
  appendEvent,
  getEventStream,
  getCurrentVersion,
} = require("./services/eventStore");

const connectDB = require("./config/db");

const run = async () => {
  const shipmentId = "TEST-EVENT-001";

  try {
    await connectDB();

    console.log("\nTesting Event Store...\n");

    const event1 = await appendEvent({
      shipmentId,
      eventType: "CONTAINER_CREATED",
      payload: {
        location: "Mumbai Warehouse",
      },
      expectedVersion: 0,
    });

    console.log(
      "Event 1 version:",
      event1.version
    );

    const event2 = await appendEvent({
      shipmentId,
      eventType: "LOADED_ON_TRUCK",
      payload: {
        location: "Mumbai Warehouse",
      },
      expectedVersion: 1,
    });

    console.log(
      "Event 2 version:",
      event2.version
    );

    const currentVersion =
      await getCurrentVersion(shipmentId);

    console.log(
      "Current version:",
      currentVersion
    );

    const events =
      await getEventStream(shipmentId);

    console.log(
      "Event count:",
      events.length
    );

    console.log("\nEvents:");

    events.forEach((event) => {
      console.log(
        `Version ${event.version}: ${event.eventType}`
      );
    });

    console.log(
      "\nEvent Store test completed successfully."
    );
  } catch (error) {
    console.error(
      "\nEvent Store test failed:"
    );

    console.error(error);
  } finally {
    await mongoose.connection.close();
  }
};

run();