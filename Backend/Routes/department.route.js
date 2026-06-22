const express = require("express");
const router = express.Router();
const { createDepartment, getAllDepartments } = require("../Controllers/department.controller");

// استدعاء الميدل وير بشكل صحيح كـ دالة مباشرة
const adminMiddleware = require("../Middlewares/Admin.Middleware"); 

// تطبيق الميدل وير على جميع الراوتس بالأسفل
router.use(adminMiddleware); 

router.post("/", createDepartment);
router.get("/", getAllDepartments);

module.exports = router;