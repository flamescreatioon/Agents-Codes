# Retell AI Function Schemas

This document contains the JSON schemas you need to configure in the Retell AI dashboard for each custom function.

## 1. Get Appointments by Phone Number

**Function Name:** `get_appointments_by_phone`

**Description:** Retrieve appointments for a specific phone number

**HTTP Method:** POST

**Endpoint URL:** `https://your-domain.com/retell-webhook`

**JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "phone": {
      "type": "string",
      "description": "The phone number to search appointments for (e.g., +1234567890)"
    }
  },
  "required": ["phone"]
}
```

---

## 2. Get Appointments by Date

**Function Name:** `get_appointments_by_date`

**Description:** Retrieve appointments scheduled for a specific date

**HTTP Method:** POST

**Endpoint URL:** `https://your-domain.com/retell-webhook`

**JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "description": "The date to search appointments for in YYYY-MM-DD format (e.g., 2025-09-25)"
    }
  },
  "required": ["date"]
}
```

---

## 3. Create New Appointment

**Function Name:** `create_appointment`

**Description:** Book a new appointment with the provided details

**HTTP Method:** POST

**Endpoint URL:** `https://your-domain.com/retell-webhook`

**JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The full name of the person booking the appointment"
    },
    "phone": {
      "type": "string",
      "description": "The phone number of the person booking the appointment (optional)"
    },
    "date": {
      "type": "string",
      "description": "The date of the appointment in YYYY-MM-DD format"
    },
    "time": {
      "type": "string",
      "description": "The time of the appointment (e.g., '10:00 AM', '2:30 PM')"
    },
    "purpose": {
      "type": "string",
      "description": "The purpose or reason for the appointment (optional)"
    }
  },
  "required": ["name", "date", "time"]
}
```

---

## Configuration Instructions

1. **In Retell Dashboard:**
   - Go to your agent's configuration
   - Navigate to the "Functions" section
   - Click "+ Add" and select "Custom Function"

2. **For each function above:**
   - Set the function name exactly as specified
   - Use the provided description
   - Select "POST" as HTTP method
   - Enter your webhook URL: `https://your-domain.com/retell-webhook`
   - Copy and paste the JSON schema into the parameters field
   - Set both "Speak during execution" and "Speak after execution" to true

3. **Environment Variables:**
   Make sure to set your `RETELL_API_KEY` in your environment variables for signature verification.

4. **Prompt Instructions:**
   Add these instructions to your agent's prompt:

   ```
   You are a receptionist assistant that can help with appointment management. You have access to the following functions:

   - When someone asks to check appointments by phone number, use the get_appointments_by_phone function
   - When someone asks to check appointments for a specific date, use the get_appointments_by_date function  
   - When someone wants to book a new appointment, use the create_appointment function

   Always be helpful and ask for missing required information politely.
   ```

## Testing

You can test the webhook locally using tools like ngrok to expose your local server, then use Retell's function calling feature to verify everything works correctly.