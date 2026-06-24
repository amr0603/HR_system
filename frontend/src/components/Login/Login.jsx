import React, { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios"; // استيراد ملف الأكسيوس للاتصال بالباك إند

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
if (loading) return;
setLoading(true); // ✅ الكود الصحيح والآمن لـ Vite

    try {
      // 🎯 طلب واحد فقط للباك إند الموحد (الباك إند سيتصرف ويفحص الجدولين تلقائياً)
      const response = await API.post("/users/login", { email, password });
      
      const { token, role } = response.data;
      
      // 1️⃣ حفظ التوكن والـ role في الـ LocalStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // القيمة ستكون ("Admin" أو "HR" أو "Employee")

      alert("تم تسجيل الدخول بنجاح! 🎉");

      // 2️⃣ التوجيه الذكي والصحيح بناءً على الرتبة القادمة من السيرفر
      if (role === "Admin") {
        navigate("/admin-dashboard"); // الأدمن يفتح له الداش بورد المخصصة له
      } else if (role === "HR" || role === "Employee") {
        navigate("/dashboard"); // الباقي يفتح لهم بناءً على الصلاحيات المحددة
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      // عرض رسالة الخطأ الموحدة القادمة من الباك إند
      setError(err.response?.data?.msg || err.response?.data?.message || "خطأ في البريد الإلكتروني أو كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.loginContainer}`}>
      <form className={`${styles.loginForm}`} onSubmit={handleLogin}>
        <div>
          <h2>Executive HR Pulse</h2>
          <p>
            Welcome back. Please sign in to access your administrative suite.
          </p>
        </div>

        {/* عرض رسالة الخطأ */}
        {error && (
          <div className="alert alert-danger text-center p-2" style={{ fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div className="input-group mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <i className="fa-solid fa-envelope"></i>
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="addon-wrapping">
            <i className="fa-solid fa-lock"></i>
          </span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="rememberMe" />
          <label className="form-check-label" htmlFor="rememberMe">
            I agree to the Terms of Service and Privacy Policy regarding my data.
          </label>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Checking..." : "Login to Suite"}
        </button>

        <button type="button" className={styles.button} style={{ marginTop: "10px" }}>
          Forgot password?{" "}
          <Link className={styles.link} to="/forgot-password">
            Reset here
          </Link>
        </button>

        <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          Don't have an account? Contact HR Support
        </p>
      </form>
    </div>
  );
}