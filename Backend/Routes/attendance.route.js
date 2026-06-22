const express = require("express");
const router = express.Router();

const { checkIn, checkOut, getMyAttendanceHistory } = require("../Controllers/attendance.controller");

const adminMiddleware = require("../Middlewares/Admin.Middleware"); 

router.use(adminMiddleware); 

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/my-history", getMyAttendanceHistory);


module.exports = router;