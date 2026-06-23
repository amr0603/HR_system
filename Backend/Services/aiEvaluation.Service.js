const { GoogleGenAI } = require("@google/generative-ai");
const Task = require("../Models/task");

// إعداد Gemini باستخدام المفتاح الموجود في الـ .env
// إذا لم يكن المفتاح موجوداً بعد، سنضع كوداً احتياطياً لعدم كراش السيرفر
const apiKey = process.env.GEMINI_API_KEY || "MOCK_KEY";
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * دالة إرسال بيانات الأداء لـ Gemini والحصول على التقييم
 */
const generateAIEvaluation = async (employeeData) => {
    // 1️⃣ إذا لم يكن الـ API Key متاحاً بعد (وضع المحاكاة للتجربة)
    if (apiKey === "MOCK_KEY") {
        return {
            score: 88,
            aiFeedback: "محاكاة: الموظف أظهر التزاماً ممتازاً بإنهاء المهام عالية الأهمية في الوقت المحدد. يحتاج لتطوير مهارات إدارة الوقت في المهام العادية."
        };
    }

    try {
        // 2️⃣ تجهيز الـ Prompt الموجه للـ AI
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

        // 3️⃣ استدعاء موديل Gemini 1.5 Flash السريع
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // إجبار الموظف الخارق (Gemini) إنه يرجع الإجابة كـ JSON عشان السيستم ما يغلطش
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 4️⃣ تحويل النص العائد من الـ AI إلى كائن JS (JSON Object)
        const evaluationResult = JSON.parse(responseText);
        return evaluationResult;

    } catch (error) {
        console.error("Gemini AI Evaluation Error:", error);
        // في حال حدوث أي خطأ في الـ API نرجع تقييم افتراضي مبني على الحسبة الرقمية كأمان
        const fallbackScore = Math.round(parseFloat(employeeData.stats.completionRate) || 50);
        return {
            score: fallbackScore,
            aiFeedback: "تم توليد تقييم رقمي تلقائي نظراً لعدم استجابة محرك الذكاء الاصطناعي حالياً."
        };
    }
};

module.exports = { generateAIEvaluation };