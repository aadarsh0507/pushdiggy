// Simple test script to verify client service API
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testClientServiceAPI() {
  try {
    console.log('🧪 Testing Client Service API...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server connection...');
    try {
      const response = await axios.get(`${API_BASE}/client-services/test`);
      console.log('✅ Server is running:', response.data);
    } catch (error) {
      console.log('❌ Server connection failed:', error.message);
      return;
    }

    // Test 2: Test client service creation
    console.log('\n2. Testing client service creation...');
    const testService = {
      name: 'Test Printer Service',
      description: 'Test service for debugging',
      price: '5000',
      features: ['Installation', 'Maintenance', 'Support'],
      category: 'printer',
      clientId: '686cfd218543203133c9bc1e', // Use the client ID from your error
      assignedBy: 'test-admin-id',
      status: 'active',
      billingCycle: 'monthly'
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/client-services`, testService);
      console.log('✅ Client service created successfully:', createResponse.data);
    } catch (error) {
      console.log('❌ Client service creation failed:', error.response?.data || error.message);
    }

    // Test 3: Test getting client services
    console.log('\n3. Testing get client services...');
    try {
      const getResponse = await axios.get(`${API_BASE}/client-services/client/686cfd218543203133c9bc1e`);
      console.log('✅ Client services retrieved:', getResponse.data);
    } catch (error) {
      console.log('❌ Get client services failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testClientServiceAPI(); 