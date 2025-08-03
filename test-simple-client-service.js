// Simple test for client service creation without authentication
const axios = require('axios');

async function testClientServiceCreation() {
  try {
    console.log('🧪 Testing Client Service Creation (No Auth)...\n');

    // Test data
    const testService = {
      name: 'HP Printer Service',
      description: 'Professional printer installation and maintenance',
      price: '6000',
      features: ['Installation', 'Maintenance', '24/7 Support', 'Warranty'],
      category: 'printer',
      clientId: '686cfd218543203133c9bc1e',
      assignedBy: 'test-admin-id',
      status: 'active',
      billingCycle: 'monthly'
    };

    console.log('📤 Sending request to create client service...');
    console.log('Request data:', JSON.stringify(testService, null, 2));

    const response = await axios.post('http://localhost:5000/api/client-services', testService, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ SUCCESS! Client service created:');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ ERROR creating client service:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full error:', error.response?.data);
  }
}

// Run the test
testClientServiceCreation(); 