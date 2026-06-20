const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["present", "absent", "late", "leave"],
    default: "present",
  },

  checkIn: String,
  checkOut: String,

},{ timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
