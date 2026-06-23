const mongoose = require("mongoose");
const crypto = require("crypto");
const Employee = require("../Models/Employee");
const User = require("../Models/User");

// ==========================================
// 1️⃣ Create Employee (With ACID Transactions)
// ==========================================
const createEmployee = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { username, email, phoneNumber, name, age, department, position, address, salary } = req.body;

        // Basic fields validation
        if (!username || !email || !phoneNumber || !name || !department || !salary) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "All required fields must be provided!" });
        }

        // Check if email already exists (Normalize to lower case)
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "This email is already registered in the system!" });
        }

        // Generate a secure temporary password
        const temporaryPassword = "Emp_" + crypto.randomBytes(3).toString("hex") + "!";

        // Step A: Create login credentials in User Collection
        const [newUser] = await User.create([{
            username,
            email: normalizedEmail,
            phoneNumber,
            password: temporaryPassword, // Auto-hashed by User Schema pre-save hook
            role: "Employee"
        }], { session });

        // Step B: Create employee profile details
        const [newEmployee] = await Employee.create([{
            name,
            email: normalizedEmail,
            age,
            phone: phoneNumber,
            department, 
            position: position || "Staff",
            address,
            salary,
            leaveBalance: 21, 
            userId: newUser._id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Employee account and profile created successfully.",
            temporaryPassword, 
            employee: newEmployee
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        // حجب تفاصيل الخطأ الصريحة للحفاظ على أمن النظام
        res.status(500).json({ message: "Failed to create employee. Operation aborted." });
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
        res.status(500).json({ message: "Error fetching employees." });
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
        res.status(500).json({ message: "Error fetching employee details." });
    }
};

// ==========================================
// 4️⃣ Update Employee Details (Secure from Mass Assignment)
// ==========================================
const updateEmployee = async (req, res) => {
    try {
        // حماية البيانات: استقبال الحقول المسموح بتعديلها فقط لمنع التلاعب بالحقول الحساسة مثل الراتب أو الرصيد
        const allowedUpdates = ["name", "age", "phone", "address", "position"];
        const updates = {};
        
        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            updates, // نمرر الكائن المصفى فقط بدلاً من req.body كاملاً
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found for updating!" });
        }

        res.status(200).json({ message: "Employee details updated successfully.", employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee details." });
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
        res.status(500).json({ message: "Error deleting employee record." });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};