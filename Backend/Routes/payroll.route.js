const express = require("express");
const router = express.Router();

const {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  getPayrollByEmployee,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payroll.controller");

router.post("/", createPayroll);
router.get("/", getAllPayrolls);
router.get("/:id", getPayrollById);
router.get("/employee/:employeeId", getPayrollByEmployee);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

module.exports = router;