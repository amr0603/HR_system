const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin"); // 👈 القراءة من موديل الأدمن بتاعك زي ما تحب

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    // البحث في سكيما الأدمن الخاصة بك
    const admin = await Admin.findById(decodedToken.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // 💡 التعديل هنا: بنضيف كلمة role يدوياً للكائن عشان السيستم يفهم رتبته في الخطوات الجاية
    const adminObj = admin.toObject();
    adminObj.role = "Admin"; 

    req.user = adminObj; // تثبيت الحساب باسم req.user لتوحيد قراءة الـ Middlewares
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = adminMiddleware;