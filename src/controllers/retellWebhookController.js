const db = require('../db');
const { Retell } = require('retell-sdk');

class RetellWebhookController {
    
    // Main webhook handler for Retell AI
    static async handleWebhook(req, res) {
        try {
            // Verify the request signature from Retell
            const signature = req.headers['x-retell-signature'];
            const apiKey = process.env.RETELL_API_KEY;
            
            if (!apiKey) {
                console.error('RETELL_API_KEY not found in environment variables');
                return res.status(500).json({ error: 'Server configuration error' });
            }

            // Verify signature to ensure request is from Retell
            const isValidSignature = Retell.verify(
                JSON.stringify(req.body),
                apiKey,
                signature
            );

            if (!isValidSignature) {
                console.error('Invalid Retell signature');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract function details from Retell's request format
            const { name, args, call } = req.body;
            
            if (!name) {
                return res.status(400).json({ error: 'Function name is required' });
            }

            // Route to appropriate function based on name
            switch (name) {
                case 'get_appointments_by_phone':
                    return await this.getAppointmentsByPhone(args, call, res);
                    
                case 'get_appointments_by_date':
                    return await this.getAppointmentsByDate(args, call, res);
                    
                case 'create_appointment':
                    return await this.createAppointment(args, call, res);
                    
                default:
                    return res.status(400).json({ error: `Unknown function: ${name}` });
            }
            
        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get appointments by phone number
    static async getAppointmentsByPhone(args, call, res) {
        return new Promise((resolve) => {
            const { phone } = args;
            
            if (!phone) {
                return res.status(200).json('I need a phone number to search for appointments. Could you please provide the phone number?');
            }

            const sql = "SELECT * FROM appointments WHERE phone = ?";
            
            db.all(sql, [phone], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(200).json('I encountered an error while searching for appointments. Please try again.');
                }
                
                if (rows.length === 0) {
                    return res.status(200).json(`No appointments found for phone number ${phone}.`);
                }
                
                // Format response for Retell AI (conversational format)
                let response = `I found ${rows.length} appointment${rows.length > 1 ? 's' : ''} for phone number ${phone}:\n\n`;
                
                rows.forEach((appointment, index) => {
                    response += `${index + 1}. ${appointment.name} on ${appointment.date} at ${appointment.time}`;
                    if (appointment.purpose) {
                        response += ` for ${appointment.purpose}`;
                    }
                    response += '\n';
                });
                
                return res.status(200).json(response.trim());
            });
        });
    }

    // Get appointments by date
    static async getAppointmentsByDate(args, call, res) {
        return new Promise((resolve) => {
            const { date } = args;
            
            if (!date) {
                return res.status(200).json('I need a date to search for appointments. Could you please provide the date?');
            }

            const sql = "SELECT * FROM appointments WHERE date = ?";
            
            db.all(sql, [date], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(200).json('I encountered an error while searching for appointments. Please try again.');
                }
                
                if (rows.length === 0) {
                    return res.status(200).json(`No appointments scheduled for ${date}.`);
                }
                
                // Format response for Retell AI (conversational format)
                let response = `I found ${rows.length} appointment${rows.length > 1 ? 's' : ''} scheduled for ${date}:\n\n`;
                
                rows.forEach((appointment, index) => {
                    response += `${index + 1}. ${appointment.name}`;
                    if (appointment.phone) {
                        response += ` (${appointment.phone})`;
                    }
                    response += ` at ${appointment.time}`;
                    if (appointment.purpose) {
                        response += ` for ${appointment.purpose}`;
                    }
                    response += '\n';
                });
                
                return res.status(200).json(response.trim());
            });
        });
    }

    // Create a new appointment
    static async createAppointment(args, call, res) {
        return new Promise((resolve) => {
            const { name, phone, date, time, purpose } = args;
            
            // Validate required fields
            if (!name || !date || !time) {
                return res.status(200).json('To book an appointment, I need at least the name, date, and time. Could you please provide these details?');
            }

            const sql = `INSERT INTO appointments (name, phone, date, time, purpose) VALUES (?, ?, ?, ?, ?)`;
            
            db.run(sql, [name, phone || null, date, time, purpose || null], function (err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(200).json('I encountered an error while booking the appointment. Please try again.');
                }
                
                // Format success response for Retell AI
                let response = `Great! I've successfully booked an appointment for ${name} on ${date} at ${time}`;
                if (purpose) {
                    response += ` for ${purpose}`;
                }
                response += `. The appointment ID is ${this.lastID}.`;
                
                if (phone) {
                    response += ` A confirmation will be sent to ${phone}.`;
                }
                
                return res.status(200).json(response);
            });
        });
    }
}

module.exports = RetellWebhookController;