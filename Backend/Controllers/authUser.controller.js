// Admin Model
const User = require("../models/User");
// Joi Schema
const loginSchema = require("../Validation/Admin.validation");
// JWT
const jwt = require("jsonwebtoken");
// Function
const loginController = async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error)
      return res.status(400).json({
        msg: error.details.map((err) => err.message),
      });

    //   Get Data From Value
    const { email, password } = value;
    //   Check Admin Found Or No
    const user = await User.findOne({ email }).select("+password");
    //   If User Not Found
    if (!user)
      return res.status(400).json({ msg: "Invalid Email Or Password" });
    //   Compare Password
    const matchedPassword = await user.comparePassword(password);
    //   If Password False
    if (!matchedPassword)
      return res.status(400).json({ msg: "Invalid Email Or Password" });

    const token = await jwt.sign(
      { id: user._id, role: "user.role" },
     process.evn.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    res.status(200).json({ msg: "Success Login", token });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Export
module.exports = loginController;