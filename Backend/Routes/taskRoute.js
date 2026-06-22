const express = require("express");
const router = express.Router();

// 1️⃣ إزالة الأقواس المعكوفة لأن الملف بيعمل export للدالة مباشرة بدون object
const adminMiddleware = require("../Middlewares/Admin.Middleware"); 

// 2️⃣ تصحيح حالة الأحرف لمجلد controllers (سمول) ليطابق مشروعك
const {
  createTask,
  getMyTasks,
  updateProgress,
  getAllTasks,
  deleteTask,
} = require("../controllers/taskController"); 

// Admin routes
router.post("/create", adminMiddleware, createTask);
router.get("/", adminMiddleware, getAllTasks);
router.delete("/:id", adminMiddleware, deleteTask);

// Employee routes
router.get("/my-tasks", adminMiddleware, getMyTasks);
router.patch("/:id/progress", adminMiddleware, updateProgress);

module.exports = router;