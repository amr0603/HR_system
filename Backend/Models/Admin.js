const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 chars"]
    }
}, { timestamps: true });

adminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;