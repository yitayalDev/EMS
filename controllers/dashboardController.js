const Employee = require('../models/employee');
const Department = require('../models/department');
const Leave = require('../models/leave');
const Salary = require('../models/salary');

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

exports.getChartData = async (req, res) => {
  try {
    // 1. Employees per department
    const departments = await Department.find();
    const deptCounts = await Promise.all(
      departments.map(async (dept) => ({
        name: dept.name,
        count: await Employee.countDocuments({ department: dept._id }),
      }))
    );

    // 2. Leave status breakdown
    const [pending, approved, rejected] = await Promise.all([
      Leave.countDocuments({ status: 'pending' }),
      Leave.countDocuments({ status: 'approved' }),
      Leave.countDocuments({ status: 'rejected' }),
    ]);

    // 3. Monthly salary totals (last 6 months)
    const now = new Date();
    const monthlyLabels = [];
    const monthlyTotals = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      monthlyLabels.push(
        d.toLocaleString('default', { month: 'short', year: 'numeric' })
      );
      const agg = await Salary.aggregate([
        { $match: { payDate: { $gte: start, $lt: end } } },
        { $group: { _id: null, total: { $sum: '$netSalary' } } },
      ]);
      monthlyTotals.push(agg.length ? agg[0].total : 0);
    }

    res.json({
      employeesByDept: { labels: deptCounts.map((d) => d.name), data: deptCounts.map((d) => d.count) },
      leaveStatus: { labels: ['Pending', 'Approved', 'Rejected'], data: [pending, approved, rejected] },
      monthlySalary: { labels: monthlyLabels, data: monthlyTotals },
    });
  } catch (err) {
    console.error('Chart data error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
