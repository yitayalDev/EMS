const axios = require('axios');
const API_URL = 'https://server-at3h.onrender.com/api';

const test = async () => {
    try {
        console.log('Testing Departments...');
        const depRes = await axios.get(`${API_URL}/departments`);
        console.log('Departments Count:', depRes.data.length);
        console.log('Departments:', JSON.stringify(depRes.data, null, 2));

        console.log('\nTesting Employees...');
        const empRes = await axios.get(`${API_URL}/employees`);
        console.log('Employees Count:', empRes.data.length);
        console.log('Employees:', JSON.stringify(empRes.data, null, 2));
    } catch (err) {
        if (err.response) {
            console.error('Error Status:', err.response.status);
            console.error('Error Data:', err.response.data);
        } else {
            console.error('Error Message:', err.message);
        }
    }
};

test();
