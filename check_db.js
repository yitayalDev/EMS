const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const Employee = require('./models/employee');
const Department = require('./models/department');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const employees = await Employee.find().populate('department').populate('user');
        console.log(`Found ${employees.length} employees:`);
        employees.forEach((emp, i) => {
            console.log(`${i + 1}. Name: ${emp.name}, Email: ${emp.email}, Dept: ${emp.department?.name || 'NULL'}, User: ${emp.user?.email || 'NULL'}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkDB();
