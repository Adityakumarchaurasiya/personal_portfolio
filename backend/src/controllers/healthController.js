const mongoose = require("mongoose");

function getHealth(_req, res) {
  const mongoConnected = mongoose.connection.readyState === 1;
  res.json({
    ok: true,
    message: "API is running",
    mongodb: mongoConnected ? "connected" : "disconnected",
  });
}

module.exports = { getHealth };
