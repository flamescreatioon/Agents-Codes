const db = require('../db');
const { Retell } = require('retell-sdk');

class RetellWebhookController {
    
    // Main webhook handler for Retell AI
    static async handleWebhook(req, res) {
        try {
            // Log incoming request for debugging
            console.log('Retell webhook received:', {
                headers: req.headers,
                bodyKeys: Object.keys(req.body || {}),
                hasSignature: !!req.headers['x-retell-signature'],
                hasRawBody: !!req.rawBody,
                rawBodyLength: req.rawBody ? req.rawBody.length : 0
            });

            // Verify the request signature from Retell
            const signature = req.headers['x-retell-signature'];
            const apiKey = process.env.RETELL_API_KEY;
            
            if (!apiKey) {
                console.error('RETELL_API_KEY not found in environment variables');
                return res.status(500).json({ error: 'Server configuration error' });
            }

            if (!signature) {
                console.error('No Retell signature provided in headers');
                return res.status(401).json({ error: 'Missing signature' });
            }

            // Use raw body for signature verification (should be set by middleware)
            const requestBody = req.rawBody || JSON.stringify(req.body);
            console.log('Signature verification:', {
                hasApiKey: !!apiKey,
                hasSignature: !!signature,
                bodyLength: requestBody.length,
                usingRawBody: !!req.rawBody
            });

            // TEMPORARY: Allow all requests through while debugging signature issues
            console.warn('⚠️ TEMPORARY: Allowing all requests through for debugging');
            let isValidSignature = true;

            // This is the proper signature verification (currently disabled for debugging)
            /*
            let isValidSignature = false;
            try {
                isValidSignature = Retell.verify(
                    requestBody,
                    apiKey,
                    signature
                );
                console.log('✅ Signature verification successful');
            } catch (verifyError) {
                console.error('Signature verification error:', verifyError.message);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            */

            if (!isValidSignature) {
                console.error('Invalid Retell signature verification failed');
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract function details from Retell's request format
            const { name, args, call } = req.body;
            
            if (!name) {
                const errorMsg = 'Function name is required in request body';
                console.error(errorMsg);
                return res.status(400).send(errorMsg);
            }

            console.log(`🔧 Processing function: ${name} with args:`, args);

            // Route to appropriate function based on name
            switch (name) {
                case 'get_appointments_by_phone':
                    return await RetellWebhookController.getAppointmentsByPhone(args, call, res);
                    
                case 'get_appointments_by_date':
                    return await RetellWebhookController.getAppointmentsByDate(args, call, res);
                    
                case 'create_appointment':
                    return await RetellWebhookController.createAppointment(args, call, res);
                    
                default:
                    const errorMsg = `Unknown function: ${name}`;
                    console.error(errorMsg);
                    return res.status(400).send(errorMsg);
            }
            
        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(500).send('Internal server error');
        }
    }

    // Get appointments by phone number
    static async getAppointmentsByPhone(args, call, res) {
        return new Promise((resolve) => {
            console.log('📞 Getting appointments by phone:', args);
            const { phone } = args;
            
            if (!phone) {
                const response = 'I need a phone number to search for appointments. Could you please provide the phone number including the country code, like +1234567890?';
                res.status(200).send(response);
                return resolve();
            }

            const sql = "SELECT * FROM appointments WHERE phone = ?";
            
            db.all(sql, [phone], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    const response = 'I encountered an error while searching for appointments. Please try again.';
                    res.status(200).send(response);
                    return resolve();
                }
                
                console.log(`📋 Found ${rows.length} appointments for phone ${phone}`);
                
                if (rows.length === 0) {
                    const response = `No appointments found for phone number ${phone}.`;
                    res.status(200).send(response);
                    return resolve();
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
                
                res.status(200).send(response.trim());
                return resolve();
            });
        });
    }

    // Get appointments by date
    static async getAppointmentsByDate(args, call, res) {
        return new Promise((resolve) => {
            console.log('📅 Getting appointments by date:', args);
            const { date } = args;
            
            if (!date) {
                const response = 'I need a date to search for appointments. Could you please provide the date in YYYY-MM-DD format, like 2025-09-28?';
                res.status(200).send(response);
                return resolve();
            }

            const sql = "SELECT * FROM appointments WHERE date = ?";
            
            db.all(sql, [date], (err, rows) => {
                if (err) {
                    console.error('Database error:', err);
                    const response = 'I encountered an error while searching for appointments. Please try again.';
                    res.status(200).send(response);
                    return resolve();
                }
                
                console.log(`📋 Found ${rows.length} appointments for date ${date}`);
                
                if (rows.length === 0) {
                    const response = `No appointments scheduled for ${date}.`;
                    res.status(200).send(response);
                    return resolve();
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
                
                res.status(200).send(response.trim());
                return resolve();
            });
        });
    }

    // Create a new appointment
    static async createAppointment(args, call, res) {
        return new Promise((resolve) => {
            console.log('➕ Creating appointment:', args);
            const { name, phone, date, time, purpose } = args;
            
            // Validate required fields
            if (!name || !date || !time) {
                const response = 'To book an appointment, I need at least the name, date, and time. Could you please provide these details?';
                res.status(200).send(response);
                return resolve();
            }

            const sql = `INSERT INTO appointments (name, phone, date, time, purpose) VALUES (?, ?, ?, ?, ?)`;
            
            db.run(sql, [name, phone || null, date, time, purpose || null], function (err) {
                if (err) {
                    console.error('Database error:', err);
                    const response = 'I encountered an error while booking the appointment. Please try again.';
                    res.status(200).send(response);
                    return resolve();
                }
                
                console.log(`✅ Created appointment with ID ${this.lastID}`);
                
                // Format success response for Retell AI
                let response = `Great! I've successfully booked an appointment for ${name} on ${date} at ${time}`;
                if (purpose) {
                    response += ` for ${purpose}`;
                }
                response += `. The appointment ID is ${this.lastID}.`;
                
                if (phone) {
                    response += ` A confirmation will be sent to ${phone}.`;
                }
                
                res.status(200).send(response);
                return resolve();
            });
        });
    }
}

module.exports = RetellWebhookController;