const axios = require('axios');
const { Retell } = require('retell-sdk');

// Test configuration
const BASE_URL = 'http://localhost:5000';
const RETELL_API_KEY = 'test-key-for-local-testing'; // Use a test key for local testing

// Mock call object (similar to what Retell sends)
const mockCall = {
  call_id: 'test-call-123',
  agent_id: 'test-agent-456',
  call_type: 'inbound',
  call_status: 'in_progress',
  transcript: [
    {
      role: 'user',
      content: 'I want to book an appointment'
    }
  ],
  start_timestamp: Date.now()
};

// Helper function to create signed request
function createSignedRequest(body, apiKey) {
  const bodyString = JSON.stringify(body);
  // For testing purposes, we'll create a mock signature
  // In production, Retell creates this signature
  const signature = 'mock-signature-for-testing';
  return {
    body: bodyString,
    headers: {
      'Content-Type': 'application/json',
      'X-Retell-Signature': signature
    }
  };
}

// Test functions
async function testGetAppointmentsByPhone() {
  console.log('\n🧪 Testing: Get Appointments by Phone');
  
  const requestBody = {
    name: 'get_appointments_by_phone',
    call: mockCall,
    args: {
      phone: '+1234567890'
    }
  };

  try {
    const { body, headers } = createSignedRequest(requestBody, RETELL_API_KEY);
    
    const response = await axios.post(`${BASE_URL}/retell-webhook`, 
      JSON.parse(body), 
      { headers }
    );
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

async function testGetAppointmentsByDate() {
  console.log('\n🧪 Testing: Get Appointments by Date');
  
  const requestBody = {
    name: 'get_appointments_by_date',
    call: mockCall,
    args: {
      date: '2025-09-20'
    }
  };

  try {
    const { body, headers } = createSignedRequest(requestBody, RETELL_API_KEY);
    
    const response = await axios.post(`${BASE_URL}/retell-webhook`, 
      JSON.parse(body), 
      { headers }
    );
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

async function testCreateAppointment() {
  console.log('\n🧪 Testing: Create Appointment');
  
  const requestBody = {
    name: 'create_appointment',
    call: mockCall,
    args: {
      name: 'Test User',
      phone: '+1234567999',
      date: '2025-10-01',
      time: '2:00 PM',
      purpose: 'Test appointment from webhook'
    }
  };

  try {
    const { body, headers } = createSignedRequest(requestBody, RETELL_API_KEY);
    
    const response = await axios.post(`${BASE_URL}/retell-webhook`, 
      JSON.parse(body), 
      { headers }
    );
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

async function testInvalidFunction() {
  console.log('\n🧪 Testing: Invalid Function Name');
  
  const requestBody = {
    name: 'invalid_function',
    call: mockCall,
    args: {}
  };

  try {
    const { body, headers } = createSignedRequest(requestBody, RETELL_API_KEY);
    
    const response = await axios.post(`${BASE_URL}/retell-webhook`, 
      JSON.parse(body), 
      { headers }
    );
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

async function testMissingParameters() {
  console.log('\n🧪 Testing: Missing Required Parameters');
  
  const requestBody = {
    name: 'create_appointment',
    call: mockCall,
    args: {
      name: 'Test User'
      // Missing required fields: date, time
    }
  };

  try {
    const { body, headers } = createSignedRequest(requestBody, RETELL_API_KEY);
    
    const response = await axios.post(`${BASE_URL}/retell-webhook`, 
      JSON.parse(body), 
      { headers }
    );
    
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

async function testHealthCheck() {
  console.log('\n🧪 Testing: Health Check');
  
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✅ Status:', response.status);
    console.log('📄 Response:', response.data);
  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Retell Webhook Tests');
  console.log('=================================');
  
  // First, check if server is running
  await testHealthCheck();
  
  // Test each webhook function
  await testGetAppointmentsByPhone();
  await testGetAppointmentsByDate();
  await testCreateAppointment();
  await testInvalidFunction();
  await testMissingParameters();
  
  console.log('\n🎉 All tests completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Seed some test data: node src/seedData.js');
  console.log('2. Deploy to Fly.io');
  console.log('3. Configure your Retell agent with the webhook URL');
  console.log('4. Add the function schemas in Retell dashboard');
}

// Check if server is accessible before running tests
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/`, { timeout: 5000 });
    console.log('✅ Server is accessible');
    return true;
  } catch (error) {
    console.log('❌ Server is not accessible. Make sure it\'s running on port 5000');
    console.log('   Run: npm start');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking server accessibility...');
  
  const serverAccessible = await checkServer();
  if (serverAccessible) {
    await runAllTests();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testGetAppointmentsByPhone,
  testGetAppointmentsByDate,
  testCreateAppointment,
  testInvalidFunction,
  testMissingParameters,
  runAllTests
};