// require express
const express = require("express");
// Router
const router = express.Router();

const adminMiddleware = require("../Middlewares/Admin.Middleware");

// Require Controller (قمنا بتغيير الاستدعاء ليستقبل كل الدوال كـ Object)
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../Controllers/user.controller");

router.use(adminMiddleware);

// 1️⃣ مسار إنشاء مستخدم جديد
router.post("/", createUser);

// 2️⃣ مسار جلب جميع المستخدمين
router.get("/", getAllUsers);

// 3️⃣ مسار جلب مستخدم معين بواسطة الـ ID
router.get("/:id", getUserById);

// 4️⃣ مسار تحديث بيانات مستخدم بواسطة الـ ID
router.put("/:id", updateUser);

// 5️⃣ مسار حذف مستخدم بواسطة الـ ID
router.delete("/:id", deleteUser);

// Export
module.exports = router;