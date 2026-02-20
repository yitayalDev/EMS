const axios = require('axios');
const API_URL = 'https://server-at3h.onrender.com/api';

const testDepartments = async () => {
    try {
        const res = await axios.get(`${API_URL}/departments`);
        console.log('Departments:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error:', err.response?.status, err.response?.data || err.message);
    }
};

testDepartments();
