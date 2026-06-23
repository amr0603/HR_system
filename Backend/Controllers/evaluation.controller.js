const Evaluation = require("../Models/Evaluation");
const Employee = require("../Models/Employee");
const Task = require("../Models/task");
// 1️⃣ التعديل هنا: اسم الكلاس الصحيح للمكتبة
const { GoogleGenerativeAI } = require("@google/generative-ai");

// إعداد Gemini باستخدام الـ API Key من ملف الـ .env
const apiKey = process.env.GEMINI_API_KEY || "MOCK_KEY";
// 2️⃣ التعديل هنا: عمل instance بشكل سليم
const ai = new GoogleGenerativeAI(apiKey);
/* -------------------------------------------------------------------------- */
/* 1) دالة توليد التقييم عبر الـ AI (تم دمجها هنا لمنع أخطاء المسارات)      */
/* -------------------------------------------------------------------------- */
const generateAIEvaluation = async (employeeData) => {
    // وضع المحاكاة إذا لم يكن المفتاح متاحاً بعد في الـ .env
    if (apiKey === "MOCK_KEY") {
        return {
            score: 88,
            aiFeedback: "محاكاة: الموظف أظهر التزاماً ممتازاً بإنهاء المهام عالية الأهمية في الوقت المحدد. يحتاج لتطوير مهارات إدارة الوقت في المهام العادية."
        };
    }

    try {
        const prompt = `
        You are an expert HR Performance Reviewer. Analyze the following employee monthly task completion data and provide an objective evaluation score (0-100) and a brief professional constructive feedback (in Arabic).

        ### Employee Data:
        - Total Tasks Assigned: ${employeeData.stats.totalTasks}
        - Completed Tasks: ${employeeData.stats.completedTasks}
        - Pending/In Progress Tasks: ${employeeData.stats.pendingTasks + employeeData.stats.inProgressTasks}
        - Completed On Time: ${employeeData.stats.completedOnTime}
        - Completed Late: ${employeeData.stats.completedLate}
        - Overall Completion Rate: ${employeeData.stats.completionRate}

        ### Task Details (Title & Priority & Status & OnTime):
        ${JSON.stringify(employeeData.taskDetails, null, 2)}

        ### IMPORTANT: Your response must be in strict JSON format only, with exactly these two keys:
        {
            "score": (number between 0 and 100 based on completion rate and on-time performance),
            "aiFeedback": "Detailed professional feedback in Arabic analyzing their performance, strengths, and areas of improvement"
        }
        `;

        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return JSON.parse(responseText);

    } catch (error) {
        console.error("Gemini AI Evaluation Error:", error);
        // نظام حماية: إذا فشل الـ AI يتم حساب درجة رقمية تلقائية بناءً على نسبة الإنجاز
        const fallbackScore = Math.round(parseFloat(employeeData.stats.completionRate) || 50);
        return {
            score: fallbackScore,
            aiFeedback: "تم توليد تقييم رقمي تلقائي نظراً لعدم استجابة محرك الذكاء الاصطناعي حالياً."
        };
    }
};

/* -------------------------------------------------------------------------- */
/* 2) دالة تجميع بيانات أداء الموظف                                           */
/* -------------------------------------------------------------------------- */
const gatherEmployeePerformanceData = async (employeeId) => {
    const tasks = await Task.find({ assignedTo: employeeId });
    if (tasks.length === 0) return { hasData: false };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending").length;
    const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
    const completedOnTime = tasks.filter(t => t.status === "Completed" && t.completedOnTime === true).length;
    const completedLate = tasks.filter(t => t.status === "Completed" && t.completedOnTime === false).length;

    return {
        hasData: true,
        stats: {
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            completedOnTime,
            completedLate,
            completionRate: ((completedTasks / totalTasks) * 100).toFixed(1) + "%"
        },
        taskDetails: tasks.map(t => ({ title: t.title, priority: t.priority, status: t.status, onTime: t.completedOnTime }))
    };
};

/* -------------------------------------------------------------------------- */
/* 3) الـ Controller الرئيسي لتشغيل التقييم وحفظه                             */
/* -------------------------------------------------------------------------- */
const triggerEmployeeEvaluation = async (req, res) => {
    try {
        const { employeeId } = req.params;

        // 1. التأكد أن الموظف موجود فعلاً
        const employeeExists = await Employee.exists({ _id: employeeId });
        if (!employeeExists) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // 2. تجميع بيانات الأداء
        const performanceData = await gatherEmployeePerformanceData(employeeId);
        if (!performanceData.hasData) {
            return res.status(400).json({ message: "This employee has no tasks assigned yet to evaluate." });
        }

        // 3. تحديد الفترة الحالية (مثال: June 2026) لمنع التكرار
        const currentPeriod = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

        // 4. التحقق مما إذا كان قد تم تقييمه هذا الشهر بالفعل
        const alreadyEvaluated = await Evaluation.findOne({ employeeId, evaluationPeriod: currentPeriod });
        if (alreadyEvaluated) {
            return res.status(400).json({ message: `Employee already evaluated for ${currentPeriod}` });
        }

        // 5. استدعاء الدالة المدمجة لتوليد التقييم
        const aiResult = await generateAIEvaluation(performanceData);

        // 6. حفظ التقييم في الداتابيز
        const newEvaluation = await Evaluation.create({
            employeeId,
            score: aiResult.score,
            aiFeedback: aiResult.aiFeedback,
            evaluationPeriod: currentPeriod
        });

        return res.status(201).json({
            message: "AI Evaluation generated and saved successfully",
            data: newEvaluation
        });

    } catch (error) {
        console.error("[triggerEmployeeEvaluation Error]", error);
        return res.status(500).json({ message: "Something went wrong during AI evaluation" });
    }
};

module.exports = { triggerEmployeeEvaluation };