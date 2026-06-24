// الحارس الذكي للتحقق من الصلاحيات الدقيقة بناءً على req.user
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    // 1️⃣ تأكيد أمان: لو لسبب ما الـ userMiddleware مشغلش req.user
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login first." });
    }

    // 2️⃣ إذا كان المستخدم Admin أو HR (صلاحيات كاملة لإدارة النظام)، يمر تلقائياً
    if (req.user.role === "Admin" || req.user.role === "HR") {
      return next();
    }

    // 3️⃣ للموظف العادي (Employee): نتحقق هل يمتلك الصلاحية المحددة في مصفوفته؟
    if (req.user.permissions && req.user.permissions.includes(requiredPermission)) {
      return next();
    }

    // 4️⃣ إذا لم يمتلك الصلاحية، نرفض الطلب فوراً
    return res.status(403).json({ 
      message: "عذراً، لا تمتلك الصلاحية الكافية لإتمام هذه العملية (Access Denied)" 
    });
  };
};

module.exports = checkPermission;