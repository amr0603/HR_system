const express = require("express");
const router = express.Router();

// 1️⃣ استدعاء الـ Controllers
const { checkIn, checkOut, getMyAttendanceHistory } = require("../Controllers/attendance.controller");

// 2️⃣ استدعاء الـ Middlewares (الحراس)
const userMiddleware = require("../Middlewares/user.Middleware"); // فحص التوكن الأساسي
const checkPermission = require("../Middlewares/Permission.Middleware"); // فحص الصلاحية الدقيقة

// حماية كل المسارات القادمة للتأكد من أن المستخدم مسجل دخول وله توكن صالح
router.use(userMiddleware);

// 3️⃣ تطبيق الصلاحيات الدقيقة على المسارات
// مسار الـ Check-in والـ Check-out يحتاجان صلاحية "can_checkin"
router.post("/check-in", checkPermission("can_checkin"), checkIn);
router.post("/check-out", checkPermission("can_checkin"), checkOut);

// مسار رؤية السجل التاريخي يحتاج صلاحية "view_reports"
router.get("/my-history", checkPermission("view_reports"), getMyAttendanceHistory);

module.exports = router;