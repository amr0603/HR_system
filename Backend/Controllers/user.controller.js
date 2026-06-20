
// Require Model
const User = require("../models/User");
// Require Validation Schema
const {
  createUserSchema,
  updateUserSchema,
} = require("../Validation/userValidation");
// Create All Endpoints
// Create User
const createUser = async (req, res) => {
  try {
    // Validation 2 Option (true) con Controller | False Exist Controller
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error)
      return res
        .status(400)
        .json({ msg: error.details.map((err) => err.message) });
    // Get Data From Value
    //   const {username, email, phoneNumber, password,}
    // Check User Is Found
    const existUser = await User.findOne({ email: value.email });
    //   User Already Found Return Error Msg
    if (existUser) return res.status(400).json({ msg: "User Already Exist" });
    // Create In DB
    const newUser = await User.create(value);
    //   Send Json Response
    res.status(201).json({ msg: "Create User Success" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// Get All Users
// Get UserById
// Update User
// Delete User
// Export
module.exports = createUser;