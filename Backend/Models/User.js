// require mongoose
const mongoose = require("mongoose");
// Require Bcrypt
const bcrypt = require("bcrypt");

// Create Schema => username, email, phone Number, password, role, permissions, isActive, isOnline
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username Must Be Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Must Be Required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password Must Be Required"], // تم تعديل الرسالة هنا لتكون صحيحة منطقياً
      select: false, // لحجب الباسورد تلقائياً من الـ find إلا لو طلبناه صراحة
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["HR", "Employee", "Admin"], // تم إضافة Admin لضمان شمولية النظام
      default: "Employee",
    },
    // 🛡️ الحقل الجديد لتخزين مصفوفة الصلاحيات الدقيقة لكل مستخدم
    permissions: {
      type: [String],
      default: [], // الموظف الجديد معندوش صلاحيات افتراضية حتى يحددها الأدمن
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }, // بيعمل createdAt و updatedAt تلقائياً
);

// Pre Hook للتأكد من تشفير كلمة المرور تلقائياً قبل الحفظ في الداتابيز
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// دالة مخصصة لمقارنة الباسورد المشفر عند تسجيل الدخول
userSchema.methods.comparePassword = async function (matchedPassword) {
  return await bcrypt.compare(matchedPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);