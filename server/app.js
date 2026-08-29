const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const shipmentRoutes = require("./routes/queries/shipment");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/shipment", shipmentRoutes);

app.get("/", (req, res) => {
  res.send("Audit Trail API Running");
});

connectDB();

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
