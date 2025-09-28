# Retell Webhook 401 Unauthorized Error - Troubleshooting Guide

## 🚨 Error: `Request failed with status code 401 response data: [{"error":"1"},"Unauthorized"]`

This error indicates that the Retell signature verification is failing. Here's how to diagnose and fix it:

## 🔍 **Step 1: Check Your Environment Variables**

Make sure your `RETELL_API_KEY` is properly set:

```bash
# Check if the API key is set
echo $RETELL_API_KEY

# If not set, add it to your environment
export RETELL_API_KEY="your_actual_retell_api_key_here"
```

## 🧪 **Step 2: Enable Development Mode (Temporary Fix)**

To bypass signature verification during testing:

```bash
# Set development environment
export NODE_ENV=development

# OR specifically skip verification
export SKIP_RETELL_VERIFICATION=true

# Then restart your server
npm start
```

## 🔧 **Step 3: Test Your Webhook Endpoint**

I've added a test endpoint to help debug. Test it first:

```bash
# Test the basic webhook endpoint
curl -X POST http://localhost:5000/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📝 **Step 4: Check Retell Dashboard Configuration**

In your Retell dashboard, verify:

1. **Webhook URL is correct:**
   - Local: `http://your-ngrok-url.ngrok.io/retell-webhook`
   - Production: `https://your-domain.com/retell-webhook`

2. **Function Configuration:**
   - Method: `POST`
   - Content-Type: `application/json`
   - Endpoint URL matches your server

## 🔐 **Step 5: Verify API Key**

Your API key should:
- Start with `agent_` or `key_`
- Be from your Retell AI dashboard → Settings → API Keys
- Have proper permissions for webhook calls

## 📊 **Step 6: Check Server Logs**

With the improved logging, you should see:

```
Retell webhook received: {
  headers: { ... },
  bodyKeys: [...],
  hasSignature: true/false
}

Signature verification: {
  hasApiKey: true/false,
  hasSignature: true/false,
  bodyLength: xxx
}
```

## 🛠️ **Step 7: Common Solutions**

### **Solution A: Missing API Key**
```bash
# Add to your .env file
echo "RETELL_API_KEY=your_key_here" >> .env

# Or export directly
export RETELL_API_KEY="your_key_here"
```

### **Solution B: Wrong Webhook URL**
Make sure your Retell dashboard points to:
- Development: `https://your-ngrok-url.ngrok.io/retell-webhook`
- Production: `https://your-domain.com/retell-webhook`

### **Solution C: Signature Issues**
```bash
# Temporarily disable signature verification
export SKIP_RETELL_VERIFICATION=true
npm start
```

### **Solution D: Header Issues**
The webhook expects:
- `Content-Type: application/json`
- `X-Retell-Signature: <signature>`

## 🧪 **Testing Workflow**

1. **Start with bypass mode:**
   ```bash
   export SKIP_RETELL_VERIFICATION=true
   npm start
   ```

2. **Test a simple function call from Retell dashboard**

3. **If successful, re-enable verification:**
   ```bash
   unset SKIP_RETELL_VERIFICATION
   export NODE_ENV=production
   npm start
   ```

4. **Check logs for detailed error info**

## 📞 **Manual Test with cURL**

Test your webhook manually:

```bash
# Test without signature (should fail in production)
curl -X POST http://localhost:5000/retell-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_appointments_by_phone",
    "args": {"phone": "+1234567890"},
    "call": {"id": "test-call"}
  }'

# Test with bypass enabled (should work)
export SKIP_RETELL_VERIFICATION=true
curl -X POST http://localhost:5000/retell-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_appointments_by_phone", 
    "args": {"phone": "+1234567890"},
    "call": {"id": "test-call"}
  }'
```

## 🔍 **Debug Output Analysis**

Look for these patterns in your logs:

### **✅ Good (Working)**
```
Retell webhook received: { hasSignature: true }
Signature verification: { hasApiKey: true, hasSignature: true }
Signature verification successful
```

### **❌ Bad (API Key Missing)**
```
RETELL_API_KEY not found in environment variables
```

### **❌ Bad (No Signature)**  
```
No Retell signature provided in headers
```

### **❌ Bad (Invalid Signature)**
```
Invalid Retell signature verification failed
```

## 🚀 **Quick Fix for Development**

Add this to your `.env` file:

```env
RETELL_API_KEY=your_retell_api_key_here
NODE_ENV=development
SKIP_RETELL_VERIFICATION=true
```

Then restart your server:

```bash
npm start
```

This will bypass signature verification while you debug the setup.

## 📞 **Need More Help?**

1. **Check server logs** for the detailed error output
2. **Verify your Retell API key** in the dashboard
3. **Test with bypass mode** first to isolate the issue
4. **Use the test endpoint** to verify basic functionality

The improved logging will show you exactly what's failing in the signature verification process!