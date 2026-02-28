const Employee = require('../models/employee');
const Department = require('../models/department');
const Leave = require('../models/leave');

exports.getAdminSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    res.json({ totalEmployees, totalDepartments, pendingLeaves });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployeeSummary = async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const totalLeaves = await Leave.countDocuments({ employee: employeeId });
    const pendingLeaves = await Leave.countDocuments({
      employee: employeeId,
      status: 'pending'
    });

    res.json({ totalLeaves, pendingLeaves });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
