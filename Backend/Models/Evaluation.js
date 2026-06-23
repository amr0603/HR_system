const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
    // ربط التقييم بالموظف
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    // درجة التقييم (مثلاً من 100)
    score: {
        type: Number, 
        required: true,
        min: 0,
        max: 100
    },
    // التقرير التفصيلي والنصائح المكتوبة بواسطة الـ AI
    aiFeedback: {
        type: String, 
        required: true
    },
    // فترة التقييم (مثلاً: "June 2026") عشان نمنع التكرار في نفس الشهر
    evaluationPeriod: {
        type: String, 
        required: true
    },
    // تاريخ إصدار التقييم تلقائياً
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// حماية الموديل من الـ OverwriteError عند استدعائه في أماكن مختلفة
const Evaluation = mongoose.models.Evaluation || mongoose.model("Evaluation", evaluationSchema);

module.exports = Evaluation;