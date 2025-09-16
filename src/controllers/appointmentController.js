const db = require('../db');

exports.getAppointmentsByPhone = (req, res) => {
    const { phone } = req.params;
    const sql = "SELECT * FROM appointments WHERE phone = ?";
  
    db.all(sql, [phone], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ message: "No appointments found for this phone number." });
      res.json({ appointments: rows });
    });
  };
  
  // 📌 Check by date
  exports.getAppointmentsByDate = (req, res) => {
    const { date } = req.params;
    const sql = "SELECT * FROM appointments WHERE date = ?";
  
    db.all(sql, [date], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ message: "No appointments found for this date." });
      res.json({ appointments: rows });
    });
  };
  
  // 📌 Book new appointment
  exports.createAppointment = (req, res) => {
    const { name, phone, date, time, purpose } = req.body;
  
    if (!name || !date || !time) {
      return res.status(400).json({ error: "Name, date, and time are required." });
    }
  
    const sql = `INSERT INTO appointments (name, phone, date, time, purpose) VALUES (?, ?, ?, ?, ?)`;
  
    db.run(sql, [name, phone, date, time, purpose], function (err) {
      if (err) return res.status(500).json({ error: err.message });
  
      res.status(201).json({
        message: "Appointment booked successfully",
        appointmentId: this.lastID,
      });
    });
  };