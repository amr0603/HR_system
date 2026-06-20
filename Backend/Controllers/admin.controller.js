const Admin = require("../Models/Admin");
const loginSchema = require("../Validation/admin.validation");
const jwt = require("jsonwebtoken");

const loginadmin = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                message: error.details.map(err => err.message)
            });
        }

        const { email, password } = value;

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Invalid Email or password" });
        }

        const matchedPassword = await admin.comparePassword(password);

        if (!matchedPassword) {
            return res.status(400).json({ message: "Invalid Email or password" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = loginadmin;