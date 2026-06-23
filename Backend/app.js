require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const appServer = http.createServer(app);
const morgan = require("morgan");

app.use(express.json());

if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
}

app.get("/", (req, res) => {
    res.json({ message: "Hello World Amr" });
});

// الاتصال بقاعدة البيانات
const connectedDB = require("./Config/db");
connectedDB();

// استدعاء كافة الروابط (Routes)
const adminroute = require('./Routes/Admin.route');
const userRoutes = require("./Routes/user.route");
const userAuthRoutes = require("./Routes/authUser.route");
const employeeRoutes = require("./Routes/employee.route");
const departmentRoutes = require("./Routes/department.route");
const attendanceRoutes = require("./Routes/attendance.route");
const payrollRoutes = require("./Routes/payroll.route");
const taskRoutes = require("./Routes/task.Route");
const evaluations =require("./Routes/evaluation.route");

// تفعيل مسارات الـ API
app.use('/api/dashboard', adminroute);
app.use("/api/dashboard/users", userRoutes);
app.use("/api/users", userAuthRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/evaluations",evaluations);

// إعداد الـ Socket.io لشات الدعم الفني
const { Server } = require("socket.io");
const io = new Server(appServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

require("./Sockets/Chat.Socket")(io);

// تشغيل السيرفر
const port = process.env.PORT || 8000;
appServer.listen(port, () => {
    console.log(`Server running smoothly on port ${port}`);
});