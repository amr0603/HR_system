const express = require("express");
const router = express.Router();


const { checkIn, checkOut, getMyAttendanceHistory } = require("../Controllers/attendance.controller");

const { protectHR } = require("../Middlewares/Auth.Middleware"); 

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/my-history", getMyAttendanceHistory);

module.exports = router;