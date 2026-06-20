const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  basicSalary: {
    type: Number,
    required: true,
  },

  bonus: {
    type: Number,
    default: 0,
  },

  deductions: {
    type: Number,
    default: 0,
  },

  month: String,
  netSalary: Number,
}, { timestamps: true });

module.exports = mongoose.model("payroll", payrollSchema);