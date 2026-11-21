
const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store the latest solar reading in memory
let latestSolarData = null;

// Test whether the server is running
app.get("/", (req, res) => {
  res.json({
    message: "WattWise Solar API is running!",
    status: "online"
  });
});

// ESP32 sends solar readings here
app.post("/api/solar", (req, res) => {
  const { device_id, voltage, current, power } = req.body;

  // Validate incoming data
  if (
    typeof voltage !== "number" ||
    typeof current !== "number" ||
    typeof power !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing sensor readings"
    });
  }

  latestSolarData = {
    device_id: device_id || "SOLAR_001",
    voltage,
    current,
    power,
    timestamp: new Date().toISOString()
  };

  console.log("New solar reading:", latestSolarData);

  res.status(200).json({
    success: true,
    message: "Solar data received successfully",
    data: latestSolarData
  });
});

// Website retrieves the latest solar readings here
app.get("/api/solar", (req, res) => {
  if (!latestSolarData) {
    return res.json({
      success: true,
      message: "No solar readings received yet",
      data: null
    });
  }

  res.json({
    success: true,
    data: latestSolarData
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`WattWise Solar API running on port ${PORT}`);
});
