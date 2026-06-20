const express = require("express");

const route = express.Router();

const loginadmin = require("../Controllers/admin.controller");
const adminMiddleware = require("../Middlewares/Admin.Middleware");

console.log("adminMiddleware:", typeof adminMiddleware);
console.log("loginadmin:", typeof loginadmin);

route.post("/login" ,loginadmin);


module.exports= route;