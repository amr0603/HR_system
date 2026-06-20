const Attendance = require("../Models/Attendance");
const Employee = require("../Models/Employee");

// Secure Corporate IP (Example: replace with your actual company public IP)
// This prevents employees from checking in from their homes.
const COMPANY_ALLOWED_IP = process.env.COMPANY_IP || "192.168.1.1"; 

// Helper: Get today's date at midnight UTC for accurate daily checking
const getTodayDateMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

// Helper: Get formatted current time
const getCurrentTimeFormatted = () => {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};

// ==========================================
// 1️⃣ Secure Employee Check-In
// ==========================================
const checkIn = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted safely from verified JWT Token
        
        // 🔒 Security Check 1: Verify Corporate IP Address
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        // In production, uncomment the line below to enforce office-only check-in
        /*
        if (clientIp !== COMPANY_ALLOWED_IP && process.env.NODE_ENV === "production") {
            return res.status(403).json({ message: "Access Denied. You must be connected to the office network to Check-In." });
        }
        */

        // Find employee profile
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ message: "Secure Profile Validation Failed. Employee record not found." });
        }

        const todayMidnight = getTodayDateMidnight();

        // 🔒 Security Check 2: Prevent duplicate check-in records for the same day
        const existingAttendance = await Attendance.findOne({
            employeeId: employee._id,
            date: todayMidnight
        });

        if (existingAttendance) {
            return res.status(400).json({ message: "Operation Rejected. You have already checked in for today!" });
        }

        // Logic: Calculate if late (Deadline: 09:00 AM)
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        
        let initialStatus = "present";
        if (currentHour > 9 || (currentHour === 9 && currentMinute > 0)) {
            initialStatus = "late";
        }

        const currentTime = getCurrentTimeFormatted();

        // Save secure record
        const newAttendance = await Attendance.create({
            employeeId: employee._id,
            date: todayMidnight,
            status: initialStatus,
            checkIn: currentTime,
            checkOut: null
        });

        res.status(201).json({
            message: `Check-in securely verified and recorded at ${currentTime}.`,
            status: initialStatus
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Security Error during check-in.", error: error.message });
    }
};

// ==========================================
// 2️⃣ Secure Employee Check-Out
// ==========================================
const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find employee profile
        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ message: "Secure Profile Validation Failed. Employee record not found." });
        }

        const todayMidnight = getTodayDateMidnight();

        // Find today's existing check-in record
        const attendance = await Attendance.findOne({
            employeeId: employee._id,
            date: todayMidnight
        });

        // 🔒 Security Check 3: Prevent check-out without an active check-in
        if (!attendance) {
            return res.status(400).json({ message: "Invalid Request. You cannot check out without checking in first today." });
        }

        // 🔒 Security Check 4: Prevent duplicate check-out overwrites
        if (attendance.checkOut) {
            return res.status(400).json({ message: "Operation Locked. Check-out already completed for today." });
        }

        const currentTime = getCurrentTimeFormatted();

        // Securely update the document
        attendance.checkOut = currentTime;
        await attendance.save();

        res.status(200).json({
            message: `Check-out securely verified and recorded at ${currentTime}.`,
            attendance
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Security Error during check-out.", error: error.message });
    }
};

// ==========================================
// 3️⃣ Secure Personal History (Restricted to logged-in user only)
// ==========================================
const getMyAttendanceHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const employee = await Employee.findOne({ userId });
        if (!employee) {
            return res.status(404).json({ message: "Employee profile not found." });
        }

        // Fetch logs (Only returns records matching this specific logged-in employee)
        const history = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });

        res.status(200).json({ count: history.length, history });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving authorized history logs.", error: error.message });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getMyAttendanceHistory
};