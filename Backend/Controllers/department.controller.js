const Department = require("../Models/Department");

// 1. Create a new department
const createDepartment = async (req, res) => {
    try {
        const { name, description, manager } = req.body;
        if (!name || !manager) {
            return res.status(400).json({ message: "Department name and manager are required." });
        }

        const existingDept = await Department.findOne({ name });
        if (existingDept) {
            return res.status(400).json({ message: "Department already exists." });
        }

        const newDept = await Department.create({ name, description, manager });
        res.status(201).json({ message: "Department created successfully.", department: newDept });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating department." });
    }
};

// 2. Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ count: departments.length, departments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching departments." });
    }
};

module.exports = { createDepartment, getAllDepartments };