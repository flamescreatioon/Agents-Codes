require("dotenv").config();
const express = require("express");
const appointmentRoutes = require("./routes/appointmentRoutes")

const app = express();
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Receptionist Agent API is running...");
});

app.use("/appointments", appointmentRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

