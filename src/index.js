require("dotenv").config();
const express = require("express");
const appointmentRoutes = require("./routes/appointmentRoutes");
const retellRoutes = require("./routes/retellRoutes");

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Receptionist Agent API is running...");
});

// Test endpoint for webhook debugging
app.post("/test-webhook", (req, res) => {
    console.log('Test webhook received:', {
        headers: req.headers,
        body: req.body
    });
    res.json({ 
        message: "Test webhook received successfully",
        timestamp: new Date().toISOString(),
        body: req.body 
    });
});

// Original REST API routes (keep for backward compatibility)
app.use("/appointments", appointmentRoutes);

// Retell AI webhook endpoint
app.use("/retell-webhook", retellRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

