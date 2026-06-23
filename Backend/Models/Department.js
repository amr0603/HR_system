const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        maxlength: 50,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    manager: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        maxlength: 50,
    }
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;