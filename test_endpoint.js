const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'https://server-at3h.onrender.com/api';

const testFetch = async () => {
    try {
        // We need a token to test if it's protected (though the code showed it wasn't)
        // But let's try without first as the code I saw didn't have protect on GET /api/employees
        const res = await axios.get(`${API_URL}/employees`);
        console.log('Status:', res.status);
        console.log('Data Type:', typeof res.data);
        console.log('Is Array:', Array.isArray(res.data));
        console.log('Length:', res.data.length);
        console.log('Data:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error:', err.response?.status, err.response?.data || err.message);
    }
};

testFetch();
