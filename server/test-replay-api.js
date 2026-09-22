const run = async () => {
  const shipmentId = "CMD-TEST-001";
  const url = `http://localhost:3000/replay/${shipmentId}/state`;

  try {
    console.log("\nTesting Replay API...\n");

    const response = await fetch(url);
    const data = await response.json();

    console.log("Status code:", response.status);

    console.log(
      "\nAPI Response:\n",
      JSON.stringify(data, null, 2)
    );

    if (response.ok) {
      console.log(
        "\nReplay API test completed successfully."
      );
    } else {
      console.log(
        "\nReplay API test failed."
      );
    }
  } catch (error) {
    console.error(
      "\nReplay API request failed:",
      error.message
    );
  }
};

run();