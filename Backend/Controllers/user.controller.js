// Require Dependencies & Models
const User = require("../Models/User");
const bcrypt = require("bcrypt"); // مكتبة التشفير لحماية كلمات المرور

// Require Validation Schema
const {
  createUserSchema,
  updateUserSchema,
} = require("../Validation/userValidation");

// ==========================================
// 1. Create User (Secure)
// ==========================================
const createUser = async (req, res) => {
  try {
    // 1️⃣ التحقق من صحة البيانات القادمة من العميل
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // تجاهل أي حقول غريبة غير معرفة في السكيما لحماية الداتابيز
    });

    if (error) {
      return res
        .status(400)
        .json({ msg: error.details.map((err) => err.message) });
    }

    // 2️⃣ التحقق من عدم تكرار البريد الإلكتروني
    const existUser = await User.findOne({ email: value.email.toLowerCase() });
    if (existUser) return res.status(400).json({ msg: "User Already Exist" });

    // 3️⃣ تشفير كلمة المرور لحمايتها في حال اختراق قاعدة البيانات
    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);

    // 4️⃣ الحفظ في قاعدة البيانات
    const newUser = await User.create(value);
    
    // تحويل المستند لكائن وحذف الباسورد قبل إرجاعه في الـ Response زيادة أمان
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ msg: "Create User Success", data: userResponse });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ==========================================
// 2. Get All Users (Secure)
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    // استرجاع كافة المستخدمين مع استثناء الباسورد تماماً من النتيجة
    const users = await User.find().select("-password");
    res.status(200).json({ msg: "Fetch Users Success", count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ==========================================
// 3. Get User By ID (Secure)
// ==========================================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // جلب المستخدم وحجب الباسورد
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ msg: "User Not Found" });

    res.status(200).json({ msg: "Fetch User Success", data: user });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ==========================================
// 4. Update User (Secure)
// ==========================================
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // عمل Validation على البيانات المراد تعديلها
    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res
        .status(400)
        .json({ msg: error.details.map((err) => err.message) });
    }

    // إذا كان التعديل يتضمن كلمة مرور جديدة، يجب تشفيرها أولاً
    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
    }

    // التحديث في قاعدة البيانات مع إرجاع المستند الجديد وحجب الباسورد
    const updatedUser = await User.findByIdAndUpdate(id, value, { 
      new: true, 
      runValidators: true 
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ msg: "User Not Found" });

    res.status(200).json({ msg: "Update User Success", data: updatedUser });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// ==========================================
// 5. Delete User (Secure)
// ==========================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ msg: "User Not Found" });

    res.status(200).json({ msg: "Delete User Success" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Export All Controllers as an Object
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};