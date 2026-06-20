// require mongoose
const mongoose = require("mongoose");
// Require Bcrypt
const bcrypt = require("bcrypt");
// Create Schema => username, email, phone Number,password, isActive, isOnline
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
      required: [true, "Email Must Be Required"],
      select: false,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["HR", "Employee"], // تم إضافة الصلاحيات للتفريق بين الموظف والـ HR بناءً على الـ PDF
      default: "Employee",
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
  { timestamps: true },
);
// Create Pre Hook
userSchema.pre("save", async function (next) {
 
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (matchedPassword) {
  return await bcrypt.compare(matchedPassword, this.password);
};

// const User = mongoose.model("User", userSchema);

// module.exports = User;

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);