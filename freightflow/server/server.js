const path = require("path");
const express = require("express");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const driverRoutes = require("./routes/drivers");
const vehicleRoutes = require("./routes/vehicles");
const shipmentRoutes = require("./routes/shipments");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(session({
  secret: "freightflow-dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days 'to
  }
}));

// ---- mga API routes ----
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/shipments", shipmentRoutes);

const publicDir = path.join(__dirname, "..");
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`FreightFlow server running at http://localhost:${PORT}`);
});
