const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "assignedTo is required"],
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    dueDate: {
      type: Date,
      required: [true, "dueDate is required"],
      validate: {
        validator: function (value) {
          // dueDate لازم يكون في المستقبل وقت الإنشاء
          return value > new Date();
        },
        message: "dueDate must be a future date",
      },
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    completedDate: {
      type: Date,
      default: null,
    },

    // محسوبة تلقائيًا: هل خلصت قبل الـ Deadline أم بعده (تستخدم لاحقًا في تقييم AI)
    completedOnTime: {
      type: Boolean,
      default: null,
    },

    attachments: [
      {
        fileName: { type: String, trim: true },
        fileUrl: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Index لتسريع استعلامات "مهام الموظف" و "مهام الأدمن"
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ assignedBy: 1 });

module.exports = mongoose.model("Task", taskSchema);
