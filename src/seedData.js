const db = require('./db');

// Sample appointment data for testing
const sampleAppointments = [
  {
    name: "John Doe",
    phone: "+1234567890",
    date: "2025-09-20",
    time: "10:00 AM",
    purpose: "Medical consultation"
  },
  {
    name: "Jane Smith",
    phone: "+1234567891",
    date: "2025-09-20",
    time: "2:30 PM",
    purpose: "Dental checkup"
  },
  {
    name: "Mike Johnson",
    phone: "+1234567892",
    date: "2025-09-21",
    time: "9:15 AM",
    purpose: "Business meeting"
  },
  {
    name: "Sarah Wilson",
    phone: "+1234567890",
    date: "2025-09-21",
    time: "11:45 AM",
    purpose: "Follow-up appointment"
  },
  {
    name: "Robert Brown",
    phone: "+1234567893",
    date: "2025-09-22",
    time: "3:00 PM",
    purpose: "Initial consultation"
  },
  {
    name: "Emily Davis",
    phone: "+1234567894",
    date: "2025-09-22",
    time: "4:15 PM",
    purpose: "Therapy session"
  },
  {
    name: "David Garcia",
    phone: "+1234567895",
    date: "2025-09-23",
    time: "8:30 AM",
    purpose: "Legal consultation"
  },
  {
    name: "Lisa Martinez",
    phone: "+1234567891",
    date: "2025-09-23",
    time: "1:20 PM",
    purpose: "Project review"
  }
];

function seedDatabase() {
  console.log("Starting to seed the database with sample appointments...");
  
  // First, let's clear existing data (optional - comment out if you want to keep existing data)
  db.run("DELETE FROM appointments", (err) => {
    if (err) {
      console.error("Error clearing existing data:", err.message);
      return;
    }
    console.log("Cleared existing appointment data.");
    
    // Insert sample data
    const insertSql = `INSERT INTO appointments (name, phone, date, time, purpose) VALUES (?, ?, ?, ?, ?)`;
    
    let insertedCount = 0;
    
    sampleAppointments.forEach((appointment, index) => {
      db.run(insertSql, [
        appointment.name,
        appointment.phone,
        appointment.date,
        appointment.time,
        appointment.purpose
      ], function(err) {
        if (err) {
          console.error(`Error inserting appointment ${index + 1}:`, err.message);
        } else {
          insertedCount++;
          console.log(`✅ Inserted appointment for ${appointment.name} (ID: ${this.lastID})`);
        }
        
        // Check if we've processed all appointments
        if (insertedCount + (sampleAppointments.length - insertedCount) === sampleAppointments.length) {
          console.log(`\n🎉 Database seeding completed! Inserted ${insertedCount} appointments.`);
          
          // Display summary
          console.log("\n📊 Summary of test data:");
          console.log("- Phone numbers with multiple appointments: +1234567890, +1234567891");
          console.log("- Dates with multiple appointments: 2025-09-20, 2025-09-21, 2025-09-22, 2025-09-23");
          console.log("- Various appointment purposes for realistic testing");
          
          // Close the database connection
          db.close((err) => {
            if (err) {
              console.error("Error closing database:", err.message);
            } else {
              console.log("\n✅ Database connection closed.");
            }
          });
        }
      });
    });
  });
}

// Run the seeding function
seedDatabase();