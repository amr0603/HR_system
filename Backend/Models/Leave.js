
const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  from: Date,
  to: Date,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  reason: String,
}, { timestamps: true });

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;