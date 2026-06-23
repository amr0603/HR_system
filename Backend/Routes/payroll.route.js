const express = require("express");
const router = express.Router();

const adminMiddleware = require("../Middlewares/Admin.Middleware");

const {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  getPayrollByEmployee,
  updatePayroll,
  deletePayroll,
} = require("../Controllers/payroll.controller");

router.use(adminMiddleware);

router.post("/", createPayroll);
router.get("/", getAllPayrolls);
router.get("/:id", getPayrollById);
router.get("/employee/:employeeId", getPayrollByEmployee);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

module.exports = router;