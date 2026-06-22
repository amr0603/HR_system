const Payroll = require("../Models/Payroll");

// @desc    Create new payroll record
// @route   POST /api/payroll
const createPayroll = async (req, res) => {
  try {
    const { employeeId, basicSalary, bonus = 0, deductions = 0, month } = req.body;

    if (!employeeId || !basicSalary || !month) {
      return res.status(400).json({ message: "employeeId, basicSalary, and month are required" });
    }

    const netSalary = basicSalary + bonus - deductions;

    const payroll = await Payroll.create({
      employeeId,
      basicSalary,
      bonus,
      deductions,
      month,
      netSalary,
    });

    res.status(201).json({ message: "Payroll record created successfully", payroll });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employeeId", "name email department")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: payrolls.length, payrolls });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id).populate(
      "employeeId",
      "name email department"
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getPayrollByEmployee = async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employeeId: req.params.employeeId })
      .populate("employeeId", "name email department")
      .sort({ createdAt: -1 });

    if (!payrolls.length) {
      return res.status(404).json({ message: "No payroll records found for this employee" });
    }

    res.status(200).json({ count: payrolls.length, payrolls });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updatePayroll = async (req, res) => {
  try {
    const { basicSalary, bonus, deductions, month } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    payroll.basicSalary = basicSalary ?? payroll.basicSalary;
    payroll.bonus = bonus ?? payroll.bonus;
    payroll.deductions = deductions ?? payroll.deductions;
    payroll.month = month ?? payroll.month;

    // Recalculate net salary
    payroll.netSalary = payroll.basicSalary + payroll.bonus - payroll.deductions;

    const updated = await payroll.save();

    res.status(200).json({ message: "Payroll record updated successfully", payroll: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    res.status(200).json({ message: "Payroll record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  getPayrollByEmployee,
  updatePayroll,
  deletePayroll,
};
