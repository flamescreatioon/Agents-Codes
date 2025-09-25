require("dotenv").config();
const express = require("express");
const appointmentRoutes = require("./routes/appointmentRoutes");
const retellRoutes = require("./routes/retellRoutes");

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Receptionist Agent API is running...");
});

// Original REST API routes (keep for backward compatibility)
app.use("/appointments", appointmentRoutes);

// Retell AI webhook endpoint
app.use("/retell-webhook", retellRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

