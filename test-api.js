// Quick API Test Script
// Run with: node test-api.js

const API_BASE = 'https://685013d7e7c42cfd17974a33.mockapi.io/taxes';

async function testEndpoints() {
    console.log('🧪 Testing API Endpoints...\n');

    // 1. GET /taxes
    console.log('1️⃣  Testing GET /taxes');
    try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        console.log(`✅ Status: ${response.status}`);
        console.log(`📊 Records: ${data.length}`);
        console.log(`First record:`, data[0]?.name || 'N/A');
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n');

    // 2. GET /taxes/:id
    console.log('2️⃣  Testing GET /taxes/2');
    try {
        const response = await fetch(`${API_BASE}/2`);
        const data = await response.json();
        console.log(`✅ Status: ${response.status}`);
        console.log(`📝 Record:`, data.name || 'N/A');
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n');

    // 3. PUT /taxes/:id
    console.log('3️⃣  Testing PUT /taxes/2');
    try {
        const response = await fetch(`${API_BASE}/2`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Update",
                country: "India"
            })
        });
        const data = await response.json();
        console.log(`✅ Status: ${response.status}`);
        console.log(`📝 Updated:`, data.name || 'N/A');
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log('\n✅ All tests completed!');
}

testEndpoints();

