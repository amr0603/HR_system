// Require Joi
const Joi = require("joi");

// CreateUserSchema (عندما يقوم الأدمن أو الـ HR بإضافة موظف جديد)
const createUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  
  // 🛡️ إضافة حقل الـ role والـ permissions لكي يقبلهم السيرفر عند الإضافة
  role: Joi.string().valid("HR", "Employee", "Admin").default("Employee"),
  permissions: Joi.array().items(Joi.string()).default([]),
});

// UpdateUserSchema (عندما يقوم الأدمن بتعديل صلاحيات أو بيانات موظف)
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  isActive: Joi.boolean().optional(),
  
  // 🛡️ السماح بتعديل الـ role أو الـ permissions بشكل منفصل أو معاً
  role: Joi.string().valid("HR", "Employee", "Admin").optional(),
  permissions: Joi.array().items(Joi.string()).optional(),
});

// Export
module.exports = { createUserSchema, updateUserSchema };