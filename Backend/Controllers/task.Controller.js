const Task = require("../Models/task");
const Employee = require("../Models/Employee"); // عدّل المسار حسب مشروعك
const mongoose = require("mongoose");
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * دالة موحّدة للرد على الأخطاء بدون تسريب تفاصيل داخلية (stack trace, query, إلخ)
 */
const handleServerError = (res, error, context) => {
  console.error(`[${context}]`, error); // اللوج الداخلي يحتفظ بالتفاصيل
  return res
    .status(500)
    .json({ message: "Something went wrong, please try again later" });
};

/* -------------------------------------------------------------------------- */
/* 1) Admin ينشئ مهمة                                                         */
/* -------------------------------------------------------------------------- */
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority } = req.body;

    // Whitelisting صريح للحقول المسموحة فقط (منع Mass Assignment)
    if (!title || !assignedTo || !dueDate) {
      return res
        .status(400)
        .json({ message: "title, assignedTo and dueDate are required" });
    }

    if (!isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: "Invalid assignedTo id" });
    }

    // تأكيد إن الموظف ده موجود بالفعل قبل إنشاء المهمة
    const employeeExists = await Employee.exists({ _id: assignedTo });
    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: "Invalid dueDate format" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.admin.id, // مأخوذة من التوكن، مش من body
      dueDate: parsedDueDate,
      priority,
    });

    return res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return handleServerError(res, error, "createTask");
  }
};

/* -------------------------------------------------------------------------- */
/* 2) الموظف يشوف المهام الخاصة به                                           */
/* -------------------------------------------------------------------------- */
const getMyTasks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // حماية من طلب آلاف السجلات مرة واحدة
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee)
      return res.status(404).json({ message: "Employee profile not found" });
    const filter = { assignedTo: employee._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter)
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    return res.json({
      data: tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleServerError(res, error, "getMyTasks");
  }
};

/* -------------------------------------------------------------------------- */
/* 3) الموظف يحدّث نسبة الإنجاز (بشرط إنها مهمته فعلاً)                       */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* 3) الموظف يحدّث نسبة الإنجاز (نسخة آمنة ومصححة)                         */
/* -------------------------------------------------------------------------- */
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    if (
      progress === undefined ||
      typeof progress !== "number" ||
      progress < 0 ||
      progress > 100
    ) {
      return res
        .status(400)
        .json({ message: "progress must be a number between 0 and 100" });
    }

    // 1️⃣ أولاً: جلب بيانات الموظف بناءً على التوكن (req.user.id)
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    // 2️⃣ ثانياً: جلب المهمة والتأكد من وجودها
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 3️⃣ ثالثاً: التحقق من أن المهمة تخص هذا الموظف فعلاً
    if (task.assignedTo.toString() !== employee._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this task" });
    }

    // تحديث البيانات
    task.progress = progress;

    if (progress === 100) {
      task.status = "Completed";
      task.completedDate = new Date();
      task.completedOnTime = task.completedDate <= task.dueDate;
    } else if (progress > 0) {
      task.status = "In Progress";
      task.completedDate = null;
      task.completedOnTime = null;
    } else {
      task.status = "Pending";
    }

    await task.save();
    return res.json(task);
  } catch (error) {
    return handleServerError(res, error, "updateProgress");
  }
};
/* -------------------------------------------------------------------------- */
/* 4) Admin يشوف كل المهام (مع Pagination و فلترة)                          */
/* -------------------------------------------------------------------------- */
const getAllTasks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.assignedTo && isValidObjectId(req.query.assignedTo)) {
      filter.assignedTo = req.query.assignedTo;
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email") // عرض الحقول الضرورية فقط، مش الباسورد أو الداتا الحساسة
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    return res.json({
      data: tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleServerError(res, error, "getAllTasks");
  }
};

/* -------------------------------------------------------------------------- */
/* 5) حذف مهمة (Admin فقط)                                                   */
/* -------------------------------------------------------------------------- */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json({ message: "Task deleted successfully" });
  } catch (error) {
    return handleServerError(res, error, "deleteTask");
  }
};

module.exports = {
  createTask,
  getMyTasks,
  updateProgress,
  getAllTasks,
  deleteTask,
};
