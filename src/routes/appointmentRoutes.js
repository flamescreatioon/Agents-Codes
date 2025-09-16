const express = require("express");
const {
  getAppointmentsByPhone,
  getAppointmentsByDate,
  createAppointment
} = require("../controllers/appointmentController");

const router = express.Router();

// Routes
router.get("/phone/:phone", getAppointmentsByPhone);
router.get("/date/:date", getAppointmentsByDate);
router.post("/", createAppointment);

module.exports = router;