const Employee = require('../models/employee');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// CREATE EMPLOYEE (Admin only)
const createEmployee = async (req, res) => {
    try {
        const { name, email, password, dob, joinDate, departmentId, position, status } = req.body;

        if (!name || !email || !password || !dob || !departmentId || !position) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'employee',
        });
        await user.save();

        let imagePath = '';
        if (req.file) imagePath = `/upload/${req.file.filename}`;

        const employee = new Employee({
            user: user._id,
            name,
            email,
            password: hashedPassword,
            dob,
            joinDate: joinDate || new Date(),
            department: departmentId,
            position,
            status: status || 'active',
            image: imagePath,
        });
        await employee.save();

        user.employee = employee._id;
        await user.save();

        res.status(201).json({ message: 'Employee created successfully', user, employee });
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department').populate('user');
        res.json(employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('department').populate('user');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const { name, email, password, dob, joinDate, departmentId, position, status } = req.body;

        if (name) employee.name = name.trim();
        if (email) employee.email = email.trim().toLowerCase();
        if (dob) employee.dob = dob;
        if (joinDate) employee.joinDate = joinDate;
        if (departmentId) employee.department = departmentId;
        if (position) employee.position = position.trim();
        if (status) employee.status = status;

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            employee.password = hashedPassword;

            const user = await User.findById(employee.user);
            if (user) {
                user.password = hashedPassword;
                await user.save();
            }
        }

        if (req.file) employee.image = `/upload/${req.file.filename}`;

        await employee.save();
        res.json({ message: 'Employee updated successfully', employee });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await User.findByIdAndDelete(employee.user);
        await employee.deleteOne();
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const updatePermissions = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const user = await User.findById(employee.user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { role, permissions } = req.body;
        if (role) user.role = role;
        if (permissions) user.permissions = permissions;

        await user.save();
        res.json({ message: 'Permissions updated successfully', user, employee });
    } catch (err) {
        console.error('Error updating permissions:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    updatePermissions,
};
