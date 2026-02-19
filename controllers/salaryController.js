const Salary = require('../models/salary');

// Admin: Get all salaries
exports.getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate('employee')
      .populate('department')
      .sort({ payDate: -1 });
    res.json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create a salary
exports.createSalary = async (req, res) => {
  try {
    const { employeeId, departmentId, basic, allowance, deductions, payDate } = req.body;

    const netSalary = Number(basic) + Number(allowance || 0) - Number(deductions || 0);

    const salary = await Salary.create({
      employee: employeeId,
      department: departmentId,
      basic,
      allowance,
      deductions,
      netSalary,
      payDate
    });

    res.status(201).json(salary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee: Get logged-in employee's salary
exports.getMySalary = async (req, res) => {
  try {
    if (!req.user.employeeId) {
      return res.status(400).json({ message: 'Employee ID not found' });
    }

    const salary = await Salary.findOne({ employee: req.user.employeeId })
      .populate('department');

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
