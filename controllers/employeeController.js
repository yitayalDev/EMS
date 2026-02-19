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

    // Check if user/email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'employee',
    });
    await user.save();

    // Handle image
    let imagePath = '';
    if (req.file) imagePath = `/upload/${req.file.filename}`;

    // Create Employee
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

    // Link User → Employee
    user.employee = employee._id;
    await user.save();

    res.status(201).json({ message: 'Employee created successfully', user, employee });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department').populate('user');
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET SINGLE EMPLOYEE
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

// UPDATE EMPLOYEE
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

    // Update password if provided
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;

      // Also update linked User password
      const user = await User.findById(employee.user);
      if (user) {
        user.password = hashedPassword;
        await user.save();
      }
    }

    // Update image
    if (req.file) employee.image = `/upload/${req.file.filename}`;

    await employee.save();
    res.json({ message: 'Employee updated successfully', employee });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Delete linked user
    await User.findByIdAndDelete(employee.user);

    await employee.deleteOne();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
