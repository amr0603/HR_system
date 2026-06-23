const express = require("express");
const router = express.Router();

const { checkIn, checkOut, getMyAttendanceHistory } = require("../Controllers/attendance.controller");

const userMiddleware = require("../Middlewares/user.Middleware");

router.use(userMiddleware);

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/my-history", getMyAttendanceHistory);


module.exports = router;