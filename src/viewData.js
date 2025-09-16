const db = require('./db');

console.log("🔍 Verifying database contents...\n");

// Function to display all appointments
function viewAllAppointments() {
  const sql = "SELECT * FROM appointments ORDER BY date, time";
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching appointments:", err.message);
      return;
    }
    
    console.log("📅 All Appointments in Database:");
    console.log("================================");
    
    if (rows.length === 0) {
      console.log("No appointments found in database.");
    } else {
      rows.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row.id}`);
        console.log(`   Name: ${row.name}`);
        console.log(`   Phone: ${row.phone}`);
        console.log(`   Date: ${row.date}`);
        console.log(`   Time: ${row.time}`);
        console.log(`   Purpose: ${row.purpose}`);
        console.log(`   Created: ${row.created_at}`);
        console.log("   ─────────────────────────────");
      });
      
      console.log(`\n📊 Total appointments: ${rows.length}\n`);
      
      // Show testing suggestions
      console.log("🧪 API Testing Suggestions:");
      console.log("==========================");
      console.log("Test these endpoints with your server running:");
      console.log("");
      console.log("1. Get appointments by phone number:");
      console.log("   GET /appointments/phone/+1234567890");
      console.log("   GET /appointments/phone/+1234567891");
      console.log("");
      console.log("2. Get appointments by date:");
      console.log("   GET /appointments/date/2025-09-20");
      console.log("   GET /appointments/date/2025-09-21");
      console.log("   GET /appointments/date/2025-09-22");
      console.log("   GET /appointments/date/2025-09-23");
      console.log("");
      console.log("3. Create new appointment:");
      console.log("   POST /appointments");
      console.log("   Body: {");
      console.log('     "name": "Test User",');
      console.log('     "phone": "+1234567999",');
      console.log('     "date": "2025-09-25",');
      console.log('     "time": "10:00 AM",');
      console.log('     "purpose": "Test appointment"');
      console.log("   }");
    }
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("\n✅ Database connection closed.");
      }
    });
  });
}

// Run the verification
viewAllAppointments();