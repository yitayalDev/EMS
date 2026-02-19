const Department = require('../models/department');

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Department already exists' });

    const department = await Department.create({ name });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const department = await Department.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!department) return res.status(404).json({ message: 'Not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
