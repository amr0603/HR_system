const express = require("express");
const router = express.Router();
const { triggerEmployeeEvaluation } = require("../Controllers/evaluation.controller");
const adminMiddleware = require("../Middlewares/Admin.Middleware");

// مسار إطلاق التقييم للموظف بواسطة الـ ID الخاص به — الأدمن/HR فقط
router.post("/evaluate/:employeeId", adminMiddleware, triggerEmployeeEvaluation);

module.exports = router;