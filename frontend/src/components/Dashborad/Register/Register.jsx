import React, { useState } from "react";
import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api/axios"; // استيراد الأكسيوس للاتصال بالباك إند

export default function Register() {
  // 1️⃣ إنشاء الـ States لتخزين بيانات الفورم والأخطاء
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 2️⃣ دالة إرسال البيانات عند الضغط على Create Account
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // التحقق من تطابق كلمتي المرور في الفرونت إند أولاً
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين!");
      return;
    }

    setLoading(true);

    try {
      // إرسال البيانات لمسار إنشاء المستخدمين في الباك إند
   const response = await API.post("/users",
     { username, email, password });

      setSuccess("تم إنشاء الحساب بنجاح! جاري توجيهك لصفحة تسجيل الدخول...");
      
      // تفريغ الحقول بعد النجاح
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // التوجيه لصفحة الـ Login بعد ثانيتين
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      // عرض رسائل الخطأ القادمة من الباك إند (سواء من الـ Joi Validation أو الـ Database)
      const serverMessage = err.response?.data?.msg || err.response?.data?.message;
      if (Array.isArray(serverMessage)) {
        setError(serverMessage.join(" - "));
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError("حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container}`}>
      {/* 3️⃣ إضافة حدث onSubmit للفورم */}
      <form className={`${styles.register}`} onSubmit={handleRegister}>
        <div className={`${styles.int}`}>
          <i className="fa-solid fa-user-shield"></i>
          <h3>ExecuHR</h3>
          <p>Enterprise HRM Suite</p>
        </div>

        {/* عرض رسائل الخطأ أو النجاح */}
        {error && <div className="alert alert-danger text-center p-2 w-100" style={{fontSize: '14px'}}>{error}</div>}
        {success && <div className="alert alert-success text-center p-2 w-100" style={{fontSize: '14px'}}>{success}</div>}

        <div className={`${styles.form}`}>
          <div className={`${styles.input}`}>
            <div className="input-group mb-3">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa-solid fa-user"></i>
              </span>
              {/* 4️⃣ ربط الـ input بالـ state الخاصة بالـ Username */}
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={`${styles.input}`}>
            <div className="input-group mb-3">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa-solid fa-envelope"></i>
              </span>
              {/* 5️⃣ ربط الـ input بالـ state الخاصة بالإيميل */}
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className={`${styles.formpassword}`}>
          <div className={`${styles.input}`}>
            <div className="input-group mb-3">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa-solid fa-lock"></i>
              </span>
              {/* 6️⃣ ربط الـ input بالـ state الخاصة بالباسورد */}
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={`${styles.input}`}>
            <div className="input-group mb-3">
              <span className="input-group-text" id="addon-wrapping">
                <i className="fa-solid fa-lock"></i>
              </span>
              {/* 7️⃣ ربط الـ input بالـ state الخاصة بتأكيد الباسورد */}
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className={`${styles.input}`}>
          <input type="checkbox" name="agree" id="agree" required />
          <span style={{ fontSize: "12px", marginLeft: "5px" }}>
            I agree to the Terms of Service and Privacy Policy regarding my data.
          </span>
        </div>

        {/* زر الإنشاء مع حالة التحميل */}
        <button className={`${styles.button}`} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className={`${styles.line}`}></div>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}