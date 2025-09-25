# Retell AI Agent Configuration Guide

This guide explains how to configure your Retell AI agent to use the custom appointment functions.

## 🎯 Overview

Your appointment system now provides three custom functions that can be called by your Retell AI agent:
- **get_appointments_by_phone**: Look up appointments by phone number
- **get_appointments_by_date**: Look up appointments by date  
- **create_appointment**: Book a new appointment

## 🚀 Step 1: Deploy Your Webhook

First, make sure your application is deployed and accessible:

### Local Testing
```bash
npm start
# Your webhook will be available at: http://localhost:5000/retell-webhook
```

### Production Deployment (Fly.io)
```bash
fly deploy
# Your webhook will be available at: https://your-app-name.fly.dev/retell-webhook
```

## 🔧 Step 2: Configure Custom Functions in Retell Dashboard

For each function, add it in your Retell agent's dashboard:

### Function 1: Get Appointments by Phone

**Name:** `get_appointments_by_phone`

**Description:** `Retrieve appointments for a specific phone number`

**HTTP Method:** `POST`

**Endpoint URL:** `https://your-app-name.fly.dev/retell-webhook`

**Parameters Schema:**
```json
{
  "type": "object",
  "properties": {
    "phone": {
      "type": "string",
      "description": "The phone number to search appointments for (include country code, e.g., +1234567890)"
    }
  },
  "required": ["phone"],
  "additionalProperties": false
}
```

**Speech Behavior:**
- ✅ **Speak during execution:** Enabled
- ✅ **Speak after execution:** Enabled

---

### Function 2: Get Appointments by Date

**Name:** `get_appointments_by_date`

**Description:** `Retrieve all appointments scheduled for a specific date`

**HTTP Method:** `POST`

**Endpoint URL:** `https://your-app-name.fly.dev/retell-webhook`

**Parameters Schema:**
```json
{
  "type": "object", 
  "properties": {
    "date": {
      "type": "string",
      "description": "The date to search appointments for in YYYY-MM-DD format (e.g., 2025-09-25)"
    }
  },
  "required": ["date"],
  "additionalProperties": false
}
```

**Speech Behavior:**
- ✅ **Speak during execution:** Enabled
- ✅ **Speak after execution:** Enabled

---

### Function 3: Create Appointment

**Name:** `create_appointment`

**Description:** `Book a new appointment for a client`

**HTTP Method:** `POST`

**Endpoint URL:** `https://your-app-name.fly.dev/retell-webhook`

**Parameters Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Full name of the person booking the appointment"
    },
    "phone": {
      "type": "string", 
      "description": "Phone number with country code (e.g., +1234567890)"
    },
    "date": {
      "type": "string",
      "description": "Date for the appointment in YYYY-MM-DD format (e.g., 2025-09-25)"
    },
    "time": {
      "type": "string",
      "description": "Time for the appointment (e.g., 10:00 AM, 2:30 PM)"
    },
    "purpose": {
      "type": "string",
      "description": "Purpose or reason for the appointment (optional)"
    }
  },
  "required": ["name", "date", "time"],
  "additionalProperties": false
}
```

**Speech Behavior:**
- ✅ **Speak during execution:** Enabled
- ✅ **Speak after execution:** Enabled

## 📝 Step 3: Configure Your Agent Prompt

Use this example prompt as a starting point for your Retell agent:

```
You are a friendly and professional receptionist AI for a medical clinic. Your main responsibilities are to help patients check their existing appointments, schedule new appointments, and provide general assistance.

## Key Guidelines:
- Always be polite, helpful, and professional
- Collect all required information before booking appointments
- Confirm appointment details before finalizing
- Always ask for phone numbers in international format (+1234567890)
- Use YYYY-MM-DD format for dates (e.g., 2025-09-25)

## Available Functions:

### Checking Existing Appointments
When a patient wants to check their appointments:
1. Ask for their phone number
2. Call `get_appointments_by_phone` with the phone number
3. Clearly read back their appointment details

### Checking Daily Schedule
When asked about appointments on a specific date:
1. Get the date from the user
2. Call `get_appointments_by_date` with the date
3. Provide a summary of that day's appointments

### Booking New Appointments
When booking a new appointment:
1. Collect: full name, phone number, preferred date, preferred time
2. Optionally ask about the purpose/reason
3. Call `create_appointment` with all the details
4. Confirm the booking and provide the appointment ID

## Example Conversations:

**Checking appointments:**
User: "I want to check my appointments"
You: "I'd be happy to help you check your appointments. Could you please provide your phone number including the country code, like +1234567890?"
[Use get_appointments_by_phone function]

**Booking appointment:**
User: "I need to schedule an appointment"
You: "I'll help you schedule an appointment. Let me get some information from you. What's your full name?"
[Continue collecting: phone, date, time, purpose]
[Use create_appointment function]

**Daily schedule:**
User: "What appointments do you have tomorrow?"
You: "Let me check our schedule for tomorrow. What date would you like me to check? Please use the format YYYY-MM-DD, like 2025-09-26."
[Use get_appointments_by_date function]

## Important Notes:
- Always confirm appointment details before finalizing bookings
- If a function call fails, apologize and offer alternative assistance
- Be patient with users who may not be tech-savvy
- Maintain HIPAA compliance - don't share appointment details without proper verification
```

## 🧪 Step 4: Test Your Configuration

### Test Scenarios

1. **Test appointment lookup:**
   - "Hi, I want to check my appointments"
   - Provide phone: "+1234567890" 

2. **Test date lookup:**
   - "What appointments do you have on September 20th, 2025?"

3. **Test appointment booking:**
   - "I need to book an appointment"
   - Provide details step by step

4. **Test error handling:**
   - Provide invalid phone numbers
   - Try booking on past dates
   - Test missing information scenarios

### Expected Responses

The agent should:
- ✅ Collect required information systematically
- ✅ Call the appropriate functions
- ✅ Provide clear, human-friendly responses
- ✅ Handle errors gracefully
- ✅ Confirm actions before executing them

## 🔒 Security Considerations

1. **Webhook Security:**
   - Set `RETELL_API_KEY` in your environment variables
   - The webhook validates request signatures automatically

2. **Data Protection:**
   - Consider implementing additional authentication for sensitive operations
   - Log function calls for audit purposes
   - Implement rate limiting if needed

## 📊 Monitoring and Analytics

Track these metrics to ensure your agent is working properly:
- Function call success rates
- Response times
- User satisfaction
- Error frequencies

## 🐛 Troubleshooting

### Common Issues:

1. **Function not found:**
   - Verify function name matches exactly in dashboard
   - Check webhook URL is correct

2. **Parameter validation errors:**
   - Ensure JSON schema is properly formatted
   - Check required fields are marked correctly

3. **Signature validation failures:**
   - Verify RETELL_API_KEY is set correctly
   - Check webhook endpoint is receiving requests

4. **Database connection issues:**
   - Verify DATABASE_PATH environment variable
   - Check database file permissions

### Logs to Check:
- Retell dashboard function call logs
- Your application server logs  
- Database connection logs

## 🎉 Next Steps

1. Deploy your application to production
2. Configure all three functions in Retell dashboard
3. Test thoroughly with various scenarios
4. Monitor performance and user interactions
5. Iterate on your agent prompt based on real usage

Your appointment system now follows Retell AI standards and is ready for production use!