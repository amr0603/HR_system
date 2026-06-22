const User = require("../Models/User");
const loginSchema = require("../Validation/admin.validation"); // تأكد من مطابقة اسم الفولدر والملف بحروف صغيرة
const jwt = require("jsonwebtoken");

const loginController = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({ msg: "Invalid Email Or Password" });

    const matchedPassword = await user.comparePassword(password);
    if (!matchedPassword) return res.status(400).json({ msg: "Invalid Email Or Password" });

    const token = jwt.sign(
      { id: user._id, role: user.role || "employee" },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ msg: "Login Success", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = loginController;