const User = require("../Models/User");
const Admin = require("../Models/Admin"); // 👈 استدعاء موديل الأدمن المنفصل
const loginSchema = require("../Validation/admin.validation"); 
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({ msg: error.details.map((err) => err.message) });
    }

    const { email, password } = value;
    let account = null;
    let roleType = "";

    // 🔍 1. البحث أولاً في جدول الأدمن المنفصل
    account = await Admin.findOne({ email }).select("+password");
    
    if (account) {
      roleType = "Admin"; // لو لقاه هنا يبقى ده الأدمن الكبير
    } else {
      // 🔍 2. لو ملقاهوش في الأدمن، يبحث في جدول المستخدمين (HR / Employee)
      account = await User.findOne({ email }).select("+password");
      if (account) {
        roleType = account.role; // هياخد قيمته الأصلية (HR أو Employee)
      }
    }

    // ❌ إذا لم يجد الحساب في الجدولين
    if (!account) return res.status(400).json({ msg: "Invalid Email Or Password" });

    // 🔐 3. التحقق من الباسورد (الدالة شغال في الموديلين بنفس الاسم)
    const matchedPassword = await account.comparePassword(password);
    if (!matchedPassword) return res.status(400).json({ msg: "Invalid Email Or Password" });

    // 🛡️ 4. التحقق من حالة النشاط (للموظفين والـ HR فقط لأن الأدمن معندوش الحقل ده في السكيما)
    if (roleType !== "Admin" && !account.isActive) {
      return res.status(403).json({ msg: "Your account is deactivated." });
    }

    // 5. صناعة التوكن وتحديد الـ role والـ permissions بدقة
    const token = jwt.sign(
      { 
        id: account._id, 
        role: roleType, 
        permissions: account.permissions || [] // الأدمن معندوش مصفوفة بس هترجع فاضية وهو كدة كدة مسموح له بكل حاجة
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ msg: "Login Success", token, role: roleType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = loginController;