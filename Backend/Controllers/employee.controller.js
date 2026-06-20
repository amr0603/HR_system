const mongoose = require("mongoose");
const crypto = require("crypto");
const Employee = require("../Models/Employee");
const User = require("../Models/User");

// ==========================================
// 1️⃣ Create Employee (With ACIDS Transactions & Generated Password)
// ==========================================
const createEmployee = async (req, res) => {
    // Start Mongoose Session for Transaction to guarantee data integrity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { username, email, phoneNumber, name, age, department, position, address, salary } = req.body;

        // Basic fields validation
        if (!username || !email || !phoneNumber || !name || !department || !salary) {
            return res.status(400).json({ message: "All required fields must be provided!" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "This email is already registered in the system!" });
        }

        // Generate a secure temporary password for the new employee (e.g., Emp_a3f1b2!)
        const temporaryPassword = "Emp_" + crypto.randomBytes(3).toString("hex") + "!";

        // Step A: Create login credentials in User Collection
        const [newUser] = await User.create([{
            username,
            email,
            phoneNumber,
            password: temporaryPassword, // Will be automatically hashed by User Schema pre-save hook
            role: "Employee"
        }], { session });

        // Step B: Create employee profile details and link it via userId
        const newEmployee = await Employee.create([{
            name,
            email,
            age,
            phone: phoneNumber,
            department, // Must be a valid Department ObjectId
            position: position || "Staff",
            address,
            salary,
            leaveBalance: 21, // Default yearly leave balance according to requirement PDF
            userId: newUser._id
        }], { session });

        // Commit all changes if both operations succeed
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Employee account and profile created successfully with Mongoose Transaction.",
            temporaryPassword, // Return this so HR can securely hand it over to the employee
            employee: newEmployee[0]
        });

    } catch (error) {
        // Discard any partial database updates if any error happens
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Failed to create employee. Operation aborted.", error: error.message });
    }
};

// ==========================================
// 2️⃣ Get All Employees
// ==========================================
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .populate("department", "name manager")
            .populate("userId", "username isActive");

        res.status(200).json({ count: employees.length, employees });
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees.", error: error.message });
    }
};

// ==========================================
// 3️⃣ Get Employee By ID
// ==========================================
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate("department", "name manager")
            .populate("userId", "username email phoneNumber isActive");

        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        res.status(200).json({ employee });
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee details.", error: error.message });
    }
};

// ==========================================
// 4️⃣ Update Employee Details
// ==========================================
const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found for updating!" });
        }

        res.status(200).json({ message: "Employee details updated successfully.", employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee details.", error: error.message });
    }
};

// ==========================================
// 5️⃣ Delete Employee (With ACID Transactions)
// ==========================================
const deleteEmployee = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const employee = await Employee.findById(req.params.id).session(session);
        if (!employee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Employee not found!" });
        }

        // Delete from both User and Employee collections sequentially
        await User.findByIdAndDelete(employee.userId).session(session);
        await Employee.findByIdAndDelete(req.params.id).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Employee and linked user account deleted permanently." });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Error deleting employee record.", error: error.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};