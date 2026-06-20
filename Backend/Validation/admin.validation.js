const joi = require ("joi");

const loginSchema = joi.object({
    email :joi.string().email().required().trim().lowercase().min(10).max(255),
    password : joi.string().min(6).required().trim().max(12).pattern(/^[a-zA-Z0-9]+$/)       

})
module.exports = loginSchema;
