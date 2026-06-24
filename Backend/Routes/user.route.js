const express = require("express");
const router = express.Router();

// 1️⃣ استدعاء الـ Controllers
const { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require("../Controllers/user.controller");

// 2️⃣ استدعاء الحراس (Middlewares)
const userMiddleware = require("../Middlewares/user.Middleware"); // بيفحص التوكن الأساسية ويطلع req.user
const adminMiddleware = require("../Middlewares/admin.middleware"); // 👈 حارس الأدمن الأعلى فقط!

// حماية كل المسارات القادمة: لازم يكون مسجل دخول أولاً
router.use(userMiddleware);

// ========================================================
// 🔒 مسارات الإدارة الحكراً على الـ Admin الأعلى فقط 👑
// ========================================================

// الأدمن فقط هو من ينشئ مستخدم ويحدد صلاحياته (حتى لو كان الـ يوزر الجديد HR)
router.post("/", adminMiddleware, createUser);

// الأدمن فقط هو من يستطيع تعديل بيانات وصلاحيات أي مستخدم (حتى لو بيعدل للـ HR)
router.put("/:id", adminMiddleware, updateUser);

// الأدمن فقط هو من يستطيع حذف مستخدم تماماً من النظام
router.delete("/:id", adminMiddleware, deleteUser);


// ========================================================
// 📊 مسارات عامة أو للـ HR (حسب طبيعة النظام عندك)
// ========================================================
router.get("/", getAllUsers); // لرؤية قائمة الموظفين
router.get("/:id", getUserById); // لرؤية ملف موظف محدد

module.exports = router;