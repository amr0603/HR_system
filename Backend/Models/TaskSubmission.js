
const mongoose = require("mongoose");

const taskSubmissionSchema = new mongoose.Schema({

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  },

  fileUrl: String,

  notes: String,

  submittedAt: {
    type: Date,
    default: Date.now
  }

});


 const TaskSubmission =  mongoose.model( "TaskSubmission",taskSubmissionSchema);
module.exports = TaskSubmission;
